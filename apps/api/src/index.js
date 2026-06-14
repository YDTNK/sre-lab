const API_PATH = "/api/moving-assistant";

const MAX_REQUEST_BYTES = 8 * 1024;
const MAX_TOTAL_INPUT_LENGTH = 2000;

const RATE_LIMIT_PER_MINUTE = 10;
const RATE_LIMIT_PER_DAY = 50;
const RATE_LIMIT_RETRY_AFTER_SECONDS = 60;

const MONTHLY_COST_STOP_THRESHOLD_JPY = 500;
const MOCK_ESTIMATED_COST_JPY = 0;

const OPENAI_TIMEOUT_MS = 8000;

const FIELD_NAMES = [
  "furniture",
  "clothes",
  "electronics",
  "books",
  "movingDate",
  "notes",
];

const REQUIRED_AI_RESPONSE_FIELDS = [
  "summary",
  "boxEstimate",
  "packingMaterials",
  "checklist",
  "riskNotes",
  "disclaimer",
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return handleOptions();
    }

    if (url.pathname !== API_PATH) {
      await recordUsage(env, "api_errors");
      return errorResponse(
        "not_found",
        "The requested API endpoint was not found.",
        404
      );
    }

    if (request.method !== "POST") {
      await recordUsage(env, "api_errors");
      return errorResponse(
        "method_not_allowed",
        "Only POST requests are allowed for this endpoint.",
        405
      );
    }

    const contentType = request.headers.get("content-type") || "";

    if (!contentType.toLowerCase().includes("application/json")) {
      await recordUsage(env, "api_errors");
      return errorResponse(
        "unsupported_media_type",
        "Content-Type must be application/json.",
        415
      );
    }

    const contentLength = request.headers.get("content-length");

    if (contentLength && Number(contentLength) > MAX_REQUEST_BYTES) {
      await recordUsage(env, "api_errors");
      return errorResponse(
        "payload_too_large",
        "Request body is too large.",
        413
      );
    }

    await recordUsage(env, "api_requests");

    const rateLimitResult = await checkRateLimit(request, env);

    if (!rateLimitResult.allowed) {
      await recordUsage(env, "rate_limited");
      return errorResponse(
        "rate_limited",
        "Too many requests. Please try again later.",
        429,
        {
          "Retry-After": String(RATE_LIMIT_RETRY_AFTER_SECONDS),
        }
      );
    }

    let bodyText;

    try {
      bodyText = await request.text();
    } catch {
      await recordUsage(env, "api_errors");
      return errorResponse(
        "invalid_request_body",
        "Failed to read request body.",
        400
      );
    }

    if (bodyText.length > MAX_REQUEST_BYTES) {
      await recordUsage(env, "api_errors");
      return errorResponse(
        "payload_too_large",
        "Request body is too large.",
        413
      );
    }

    let body;

    try {
      body = JSON.parse(bodyText);
    } catch {
      await recordUsage(env, "api_errors");
      return errorResponse(
        "invalid_json",
        "Request body must be valid JSON.",
        400
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      await recordUsage(env, "api_errors");
      return errorResponse(
        "invalid_request_body",
        "Request body must be a JSON object.",
        400
      );
    }

    const fields = FIELD_NAMES.map((fieldName) => body[fieldName]);

    const hasAnyInput = fields.some((value) => {
      return typeof value === "string" && value.trim().length > 0;
    });

    if (!hasAnyInput) {
      await recordUsage(env, "api_errors");
      return errorResponse(
        "missing_input",
        "At least one moving information field is required.",
        400
      );
    }

    const totalInputLength = fields.reduce((total, value) => {
      if (typeof value !== "string") {
        return total;
      }

      return total + value.trim().length;
    }, 0);

    if (totalInputLength > MAX_TOTAL_INPUT_LENGTH) {
      await recordUsage(env, "api_errors");
      return errorResponse(
        "input_too_large",
        "Total input length is too large.",
        413
      );
    }

    const monthlyEstimatedCost = await getMonthlyEstimatedCost(env);

    if (monthlyEstimatedCost >= MONTHLY_COST_STOP_THRESHOLD_JPY) {
      await recordUsage(env, "api_errors");
      return errorResponse(
        "cost_limit_reached",
        "AI diagnosis is temporarily unavailable due to usage limits.",
        503
      );
    }

    const fallback = buildFallbackResponse();

    const aiResponse = await generateMovingAdviceWithOpenAI(body, env);

    await recordEstimatedCost(env, MOCK_ESTIMATED_COST_JPY);

    if (aiResponse.ok) {
      await recordUsage(env, "api_success");
      await recordUsage(env, "ai_success");
      return jsonResponse(aiResponse.data);
    }

    await recordUsage(env, "api_success");
    await recordUsage(env, "ai_errors");

    return jsonResponse({
      ...fallback,
      aiStatus: "fallback",
      fallbackReason: aiResponse.reason,
    });
  },
};

async function generateMovingAdviceWithOpenAI(body, env) {
  if (!env.OPENAI_API_KEY) {
    return {
      ok: false,
      reason: "missing_openai_api_key",
    };
  }

  await recordUsage(env, "ai_calls");

  const model = env.AI_MODEL || "gpt-4.1-nano";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content:
              "あなたは日本語の引越し準備アシスタントです。必ずJSONのみを返してください。Markdownや説明文は返さないでください。",
          },
          {
            role: "user",
            content: buildPrompt(body),
          },
        ],
        text: {
          format: {
            type: "json_object",
          },
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        ok: false,
        reason: `openai_http_${response.status}`,
      };
    }

    const responseBody = await response.json();
    const outputText = extractOpenAIOutputText(responseBody);

    if (!outputText) {
      return {
        ok: false,
        reason: "empty_openai_output",
      };
    }

    let parsed;

    try {
      parsed = JSON.parse(outputText);
    } catch {
      return {
        ok: false,
        reason: "invalid_openai_json",
      };
    }

    if (!isValidAiResponse(parsed)) {
      return {
        ok: false,
        reason: "invalid_openai_response_shape",
      };
    }

    return {
      ok: true,
      data: {
        ...parsed,
        aiStatus: "generated",
      },
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error && error.name === "AbortError") {
      return {
        ok: false,
        reason: "openai_timeout",
      };
    }

    return {
      ok: false,
      reason: "openai_request_failed",
    };
  }
}

function buildPrompt(body) {
  const normalized = FIELD_NAMES.reduce((result, fieldName) => {
    const value = body[fieldName];

    result[fieldName] = typeof value === "string" ? value.trim() : "";

    return result;
  }, {});

  return [
    "以下の引越し情報をもとに、引越し準備診断を作成してください。",
    "",
    "出力は必ず次のJSON形式にしてください。",
    "",
    JSON.stringify({
      summary: "短い要約文",
      boxEstimate: "ダンボール目安",
      packingMaterials: ["必要資材1", "必要資材2"],
      checklist: ["チェック項目1", "チェック項目2", "チェック項目3"],
      riskNotes: ["注意点1", "注意点2"],
      disclaimer: "注意書き",
    }),
    "",
    "条件:",
    "- 日本語で返す",
    "- JSON以外の文章を返さない",
    "- packingMaterials, checklist, riskNotes は配列にする",
    "- checklist は3〜6項目にする",
    "- 医療・法律・契約上の断定は避ける",
    "",
    "入力:",
    JSON.stringify(normalized),
  ].join("\n");
}

function extractOpenAIOutputText(responseBody) {
  if (typeof responseBody.output_text === "string") {
    return responseBody.output_text;
  }

  if (!Array.isArray(responseBody.output)) {
    return "";
  }

  const textParts = [];

  for (const item of responseBody.output) {
    if (!Array.isArray(item.content)) {
      continue;
    }

    for (const content of item.content) {
      if (content.type === "output_text" && typeof content.text === "string") {
        textParts.push(content.text);
      }
    }
  }

  return textParts.join("");
}

function isValidAiResponse(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }

  for (const field of REQUIRED_AI_RESPONSE_FIELDS) {
    if (!(field in data)) {
      return false;
    }
  }

  if (typeof data.summary !== "string") {
    return false;
  }

  if (typeof data.boxEstimate !== "string") {
    return false;
  }

  if (!Array.isArray(data.packingMaterials)) {
    return false;
  }

  if (!Array.isArray(data.checklist)) {
    return false;
  }

  if (!Array.isArray(data.riskNotes)) {
    return false;
  }

  if (typeof data.disclaimer !== "string") {
    return false;
  }

  return true;
}

function buildFallbackResponse() {
  return {
    summary: "入力内容をもとに、引越し準備の初期チェックリストを作成しました。",
    boxEstimate: "ダンボール目安: 8〜12箱",
    packingMaterials: [
      "ダンボール",
      "ガムテープ",
      "緩衝材",
      "油性ペン",
      "小物用袋",
    ],
    checklist: [
      "本や重い物は小さめの箱に分けて梱包する",
      "家電や電子機器は緩衝材やタオルで保護する",
      "衣類は衣装ケース・スーツケース・大きめの袋に分類する",
      "搬入経路、エレベーター、駐車スペースを事前確認する",
      "引越し1週間前までに不要品を処分する",
    ],
    riskNotes: [
      "重い物を大きな箱にまとめると運搬時に危険です",
      "電子機器は衝撃と水濡れに注意してください",
    ],
    disclaimer:
      "これはAI引越し診断のフォールバック結果です。正式な引越し業者の見積もりではありません。",
  };
}

async function checkRateLimit(request, env) {
  if (!env.RATE_LIMIT_KV) {
    return { allowed: true };
  }

  const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = new Date();

  const minuteKey = `rate:moving-assistant:minute:${clientIp}:${formatMinuteWindow(now)}`;
  const dayKey = `rate:moving-assistant:day:${clientIp}:${formatDayWindow(now)}`;

  const minuteCount = await incrementCounter(
    env.RATE_LIMIT_KV,
    minuteKey,
    RATE_LIMIT_RETRY_AFTER_SECONDS
  );

  if (minuteCount > RATE_LIMIT_PER_MINUTE) {
    return { allowed: false, reason: "minute_limit_exceeded" };
  }

  const dayCount = await incrementCounter(
    env.RATE_LIMIT_KV,
    dayKey,
    secondsUntilNextDay(now)
  );

  if (dayCount > RATE_LIMIT_PER_DAY) {
    return { allowed: false, reason: "day_limit_exceeded" };
  }

  return { allowed: true };
}

async function recordUsage(env, metricName) {
  if (!env.RATE_LIMIT_KV) {
    return;
  }

  const now = new Date();
  const key = `usage:moving-assistant:${metricName}:${formatDayWindow(now)}`;

  await incrementCounter(env.RATE_LIMIT_KV, key, secondsUntilNextDay(now));
}

async function recordEstimatedCost(env, estimatedCostJpy) {
  if (!env.RATE_LIMIT_KV || estimatedCostJpy <= 0) {
    return;
  }

  const now = new Date();
  const dailyKey = `cost:moving-assistant:estimated_jpy:${formatDayWindow(now)}`;
  const monthlyKey = `cost:moving-assistant:estimated_jpy:${formatMonthWindow(now)}`;

  await incrementNumericValue(
    env.RATE_LIMIT_KV,
    dailyKey,
    estimatedCostJpy,
    secondsUntilNextDay(now)
  );

  await incrementNumericValue(
    env.RATE_LIMIT_KV,
    monthlyKey,
    estimatedCostJpy,
    secondsUntilNextMonth(now)
  );
}

async function getMonthlyEstimatedCost(env) {
  if (!env.RATE_LIMIT_KV) {
    return 0;
  }

  const now = new Date();
  const monthlyKey = `cost:moving-assistant:estimated_jpy:${formatMonthWindow(now)}`;
  const currentValue = await env.RATE_LIMIT_KV.get(monthlyKey);

  return Number.parseFloat(currentValue || "0");
}

async function incrementCounter(kv, key, expirationTtl) {
  const currentValue = await kv.get(key);
  const currentCount = Number.parseInt(currentValue || "0", 10);
  const nextCount = currentCount + 1;

  await kv.put(key, String(nextCount), {
    expirationTtl,
  });

  return nextCount;
}

async function incrementNumericValue(kv, key, incrementBy, expirationTtl) {
  const currentValue = await kv.get(key);
  const currentNumber = Number.parseFloat(currentValue || "0");
  const nextNumber = currentNumber + incrementBy;

  await kv.put(key, String(nextNumber), {
    expirationTtl,
  });

  return nextNumber;
}

function formatMinuteWindow(date) {
  return [
    date.getUTCFullYear(),
    pad2(date.getUTCMonth() + 1),
    pad2(date.getUTCDate()),
    pad2(date.getUTCHours()),
    pad2(date.getUTCMinutes()),
  ].join("");
}

function formatDayWindow(date) {
  return [
    date.getUTCFullYear(),
    pad2(date.getUTCMonth() + 1),
    pad2(date.getUTCDate()),
  ].join("");
}

function formatMonthWindow(date) {
  return [
    date.getUTCFullYear(),
    pad2(date.getUTCMonth() + 1),
  ].join("");
}

function secondsUntilNextDay(date) {
  const nextDay = new Date(date);
  nextDay.setUTCHours(24, 0, 0, 0);

  return Math.max(60, Math.ceil((nextDay.getTime() - date.getTime()) / 1000));
}

function secondsUntilNextMonth(date) {
  const nextMonth = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    1,
    0,
    0,
    0
  ));

  return Math.max(60, Math.ceil((nextMonth.getTime() - date.getTime()) / 1000));
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: responseHeaders(extraHeaders),
  });
}

function errorResponse(code, message, status, extraHeaders = {}) {
  return jsonResponse(
    {
      error: {
        code,
        message,
      },
    },
    status,
    extraHeaders
  );
}

function responseHeaders(extraHeaders = {}) {
  return {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    ...extraHeaders,
  };
}

function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: responseHeaders(),
  });
}
