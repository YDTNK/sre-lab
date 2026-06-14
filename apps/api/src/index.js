const API_PATH = "/api/moving-assistant";

const MAX_REQUEST_BYTES = 8 * 1024;
const MAX_TOTAL_INPUT_LENGTH = 2000;

const RATE_LIMIT_PER_MINUTE = 10;
const RATE_LIMIT_PER_DAY = 50;
const RATE_LIMIT_RETRY_AFTER_SECONDS = 60;

const MONTHLY_COST_STOP_THRESHOLD_JPY = 500;
const MOCK_ESTIMATED_COST_JPY = 0;

const FIELD_NAMES = [
  "furniture",
  "clothes",
  "electronics",
  "books",
  "movingDate",
  "notes",
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

    await recordEstimatedCost(env, MOCK_ESTIMATED_COST_JPY);
    await recordUsage(env, "api_success");

    return jsonResponse({
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
        "これはAI引越し診断のモック結果です。正式な引越し業者の見積もりではありません。",
    });
  },
};

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
