const MOVING_ASSISTANT_API_PATH = "/api/moving-assistant";
const GRAFANA_ALERT_API_PATH = "/api/grafana-alert";
const GRAFANA_WEBHOOK_SECRET_HEADER = "x-grafana-webhook-secret";
const GITHUB_API_BASE_URL = "https://api.github.com";
const GRAFANA_DEDUPE_LABEL = "grafana-alert";

const MAX_REQUEST_BYTES = 8 * 1024;
const MAX_TOTAL_INPUT_LENGTH = 2000;

const RATE_LIMIT_PER_MINUTE = 10;
const RATE_LIMIT_PER_DAY = 50;
const RATE_LIMIT_RETRY_AFTER_SECONDS = 60;

const MONTHLY_COST_STOP_THRESHOLD_JPY = 500;
const DAILY_COST_HARD_LIMIT_JPY = 100;

const AI_SERVICE_DAILY_LIMIT = 30;
const AI_IP_DAILY_LIMIT = 5;
const AI_LIMIT_RETRY_AFTER_SECONDS = 86400;

const OPENAI_TIMEOUT_MS = 8000;

const ESTIMATED_OUTPUT_TOKENS = 500;
const ESTIMATED_INPUT_TOKEN_DIVISOR = 1;
const ESTIMATED_COST_PER_1K_INPUT_TOKENS_JPY = 0.02;
const ESTIMATED_COST_PER_1K_OUTPUT_TOKENS_JPY = 0.08;

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

    if (url.pathname === MOVING_ASSISTANT_API_PATH) {
      return handleMovingAssistantMock(request, env);
    }

    if (url.pathname === GRAFANA_ALERT_API_PATH) {
      return handleGrafanaAlertWebhook(request, env);
    }

    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "not_found",
      "The requested API endpoint was not found.",
      404
    );
  },
};

async function handleMovingAssistantMock(request, env) {
  if (request.method !== "POST") {
    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "method_not_allowed",
      "Only POST requests are allowed for this endpoint.",
      405
    );
  }

  const contentType = request.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "unsupported_media_type",
      "Content-Type must be application/json.",
      415
    );
  }

  let bodyText;

  try {
    bodyText = await request.text();
  } catch {
    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "invalid_request_body",
      "Failed to read request body.",
      400
    );
  }

  if (bodyText.length > MAX_REQUEST_BYTES) {
    await safeRecordUsage(env, "api_errors");
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
    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "invalid_json",
      "Request body must be valid JSON.",
      400
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    await safeRecordUsage(env, "api_errors");
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
    await safeRecordUsage(env, "api_errors");
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
    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "input_too_large",
      "Total input length is too large.",
      413
    );
  }

  await safeRecordUsage(env, "api_success");

  return jsonResponse({
    ...buildFallbackResponse(),
    aiStatus: "fallback",
    fallbackReason: "Moving Assistant uses deterministic fallback during production verification.",
    receivedInput: {
      furniture: body.furniture || "",
      clothes: body.clothes || "",
      electronics: body.electronics || "",
      books: body.books || "",
      movingDate: body.movingDate || "",
      notes: body.notes || "",
    },
  });
}

async function handleGrafanaAlertWebhook(request, env) {
  if (request.method !== "POST") {
    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "method_not_allowed",
      "Only POST requests are allowed for this endpoint.",
      405
    );
  }

  if (!env.GRAFANA_WEBHOOK_SECRET) {
    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "missing_grafana_webhook_secret",
      "Grafana webhook secret is not configured.",
      500
    );
  }

  if (!env.GITHUB_ISSUE_TOKEN) {
    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "missing_github_issue_token",
      "GitHub issue token is not configured.",
      500
    );
  }

  if (!env.GITHUB_REPO) {
    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "missing_github_repo",
      "GitHub repository is not configured.",
      500
    );
  }

  const providedSecret = request.headers.get(GRAFANA_WEBHOOK_SECRET_HEADER);

  if (!providedSecret || providedSecret !== env.GRAFANA_WEBHOOK_SECRET) {
    await safeRecordUsage(env, "api_errors");
    return errorResponse("unauthorized", "Invalid webhook secret.", 401);
  }

  const contentType = request.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "unsupported_media_type",
      "Content-Type must be application/json.",
      415
    );
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "invalid_json",
      "Request body must be valid JSON.",
      400
    );
  }

  const issue = buildGrafanaIssue(payload);
  const dedupeKey = buildGrafanaDedupeKey(payload);
  const existingIssue = await findOpenGrafanaIssue(env, dedupeKey);

  let githubResult;

  if (existingIssue) {
    githubResult = await commentOnGitHubIssue(
      env,
      existingIssue.number,
      buildGrafanaDuplicateComment(payload, dedupeKey)
    );

    if (githubResult.ok) {
      githubResult.issueUrl = existingIssue.html_url;
      githubResult.issueNumber = existingIssue.number;
      githubResult.deduped = true;
    }
  } else {
    githubResult = await createGitHubIssue(env, issue);
  }

  if (!githubResult.ok) {
    await safeRecordUsage(env, "api_errors");
    return errorResponse(
      "github_issue_create_failed",
      "Failed to create or update GitHub Issue.",
      502
    );
  }

  await safeRecordUsage(env, "grafana_alert_issues");

  return jsonResponse(
    {
      ok: true,
      deduped: Boolean(githubResult.deduped),
      issueUrl: githubResult.issueUrl,
      issueNumber: githubResult.issueNumber,
    },
    { status: githubResult.deduped ? 200 : 201 }
  );
}

function buildGrafanaIssue(payload) {
  const alertName = getGrafanaAlertName(payload);
  const status = payload?.status || "unknown";
  const externalUrl = payload?.externalURL || "";
  const receiver = payload?.receiver || "";
  const groupKey = payload?.groupKey || "";
  const dedupeKey = buildGrafanaDedupeKey(payload);
  const alerts = Array.isArray(payload?.alerts) ? payload.alerts : [];

  const alertSummaries = alerts.map((alert, index) => {
    const labels = alert.labels || {};
    const annotations = alert.annotations || {};
    const startsAt = alert.startsAt || "";
    const generatorURL = alert.generatorURL || "";

    return [
      `### Alert ${index + 1}`,
      "",
      `- status: ${alert.status || status}`,
      `- alertname: ${labels.alertname || ""}`,
      `- service: ${labels.service_name || labels.service || labels.job || ""}`,
      `- severity: ${labels.severity || ""}`,
      `- startsAt: ${startsAt}`,
      `- generatorURL: ${generatorURL}`,
      "",
      "Annotations:",
      "",
      "```json",
      JSON.stringify(annotations, null, 2),
      "```",
    ].join("\n");
  });

  const body = [
    `# Grafana Alert: ${alertName}`,
    "",
    "## Dedupe key",
    "",
    dedupeKey,
    "",
    "## Status",
    "",
    status,
    "",
    "## Receiver",
    "",
    receiver || "unknown",
    "",
    "## Group key",
    "",
    groupKey || "unknown",
    "",
    "## Service state check",
    "",
    "- [ ] active",
    "- [ ] degraded",
    "- [ ] deprecated",
    "- [ ] removed",
    "- [ ] replaced",
    "- [ ] unknown",
    "",
    "## First response checklist",
    "",
    "- [ ] Read AGENTS.md",
    "- [ ] Check docs/service-state-checklist.md",
    "- [ ] Check docs/runbook.md",
    "- [ ] Check latest records under docs/incidents/",
    "- [ ] Confirm whether this is active service failure or stale monitoring",
    "- [ ] Record findings",
    "",
    "## Alerts",
    "",
    alertSummaries.length > 0
      ? alertSummaries.join("\n\n")
      : "No alert details provided.",
    "",
    "## Links",
    "",
    `- Grafana: ${externalUrl || "not provided"}`,
    "",
    "## Raw payload summary",
    "",
    "```json",
    JSON.stringify(
      {
        status,
        receiver,
        groupKey,
        commonLabels: payload?.commonLabels || {},
        commonAnnotations: payload?.commonAnnotations || {},
      },
      null,
      2
    ),
    "```",
  ].join("\n");

  return {
    title: `Grafana Alert: ${alertName}`,
    body,
    labels: ["ops", GRAFANA_DEDUPE_LABEL],
  };
}

function getGrafanaAlertName(payload) {
  return (
    payload?.commonLabels?.alertname ||
    payload?.alerts?.[0]?.labels?.alertname ||
    payload?.title ||
    "Grafana Alert"
  );
}

function getGrafanaServiceName(payload) {
  return (
    payload?.commonLabels?.service_name ||
    payload?.commonLabels?.service ||
    payload?.commonLabels?.job ||
    payload?.alerts?.[0]?.labels?.service_name ||
    payload?.alerts?.[0]?.labels?.service ||
    payload?.alerts?.[0]?.labels?.job ||
    "unknown-service"
  );
}

function buildGrafanaDedupeKey(payload) {
  const alertName = getGrafanaAlertName(payload);
  const serviceName = getGrafanaServiceName(payload);
  const status = payload?.status || "unknown";

  return `grafana:${serviceName}:${alertName}:${status}`.toLowerCase();
}

function buildGrafanaDuplicateComment(payload, dedupeKey) {
  return [
    "## Duplicate Grafana notification",
    "",
    `Dedupe key: ${dedupeKey}`,
    "",
    `Status: ${payload?.status || "unknown"}`,
    `Received at: ${new Date().toISOString()}`,
    "",
    "This notification matched an existing open Grafana alert Issue, so no new Issue was created.",
  ].join("\n");
}

function githubHeaders(env) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${env.GITHUB_ISSUE_TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": "sre-lab-grafana-webhook",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function findOpenGrafanaIssue(env, dedupeKey) {
  const searchQuery = encodeURIComponent(
    `repo:${env.GITHUB_REPO} is:issue is:open label:${GRAFANA_DEDUPE_LABEL} "${dedupeKey}"`
  );

  const response = await fetch(`${GITHUB_API_BASE_URL}/search/issues?q=${searchQuery}`, {
    headers: githubHeaders(env),
  });

  if (!response.ok) {
    console.warn("github_issue_search_failed", response.status, await response.text());
    return null;
  }

  const data = await response.json();
  const items = Array.isArray(data.items) ? data.items : [];

  return items[0] || null;
}

async function commentOnGitHubIssue(env, issueNumber, body) {
  const response = await fetch(
    `${GITHUB_API_BASE_URL}/repos/${env.GITHUB_REPO}/issues/${issueNumber}/comments`,
    {
      method: "POST",
      headers: githubHeaders(env),
      body: JSON.stringify({ body }),
    }
  );

  if (!response.ok) {
    console.warn("github_issue_comment_failed", response.status, await response.text());
    return { ok: false };
  }

  return { ok: true };
}

async function createGitHubIssue(env, issue) {
  const response = await fetch(
    `${GITHUB_API_BASE_URL}/repos/${env.GITHUB_REPO}/issues`,
    {
      method: "POST",
      headers: githubHeaders(env),
      body: JSON.stringify(issue),
    }
  );

  if (!response.ok) {
    console.warn(
      "github_issue_create_failed",
      response.status,
      await response.text()
    );
    return { ok: false };
  }

  const data = await response.json();

  return {
    ok: true,
    issueUrl: data.html_url,
    issueNumber: data.number,
  };
}

async function checkAiDailyLimit(request, env) {
  if (!env.RATE_LIMIT_KV) {
    return { allowed: true };
  }

  const now = new Date();
  const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
  const serviceKey = `ai-limit:moving-assistant:service:${formatDayWindow(now)}`;
  const ipKey = `ai-limit:moving-assistant:ip:${clientIp}:${formatDayWindow(now)}`;

  const serviceCount = await incrementCounter(
    env.RATE_LIMIT_KV,
    serviceKey,
    secondsUntilNextDay(now)
  );

  if (serviceCount > AI_SERVICE_DAILY_LIMIT) {
    return { allowed: false, reason: "service_daily_ai_limit_exceeded" };
  }

  const ipCount = await incrementCounter(
    env.RATE_LIMIT_KV,
    ipKey,
    secondsUntilNextDay(now)
  );

  if (ipCount > AI_IP_DAILY_LIMIT) {
    return { allowed: false, reason: "ip_daily_ai_limit_exceeded" };
  }

  return { allowed: true };
}

function estimateAiUsage(body) {
  const inputTextLength = FIELD_NAMES.reduce((total, fieldName) => {
    const value = body[fieldName];

    if (typeof value !== "string") {
      return total;
    }

    return total + value.trim().length;
  }, 0);

  const estimatedInputTokens = Math.max(
    1,
    Math.ceil(inputTextLength / ESTIMATED_INPUT_TOKEN_DIVISOR)
  );

  const estimatedOutputTokens = ESTIMATED_OUTPUT_TOKENS;

  const estimatedInputCostJpy =
    (estimatedInputTokens / 1000) * ESTIMATED_COST_PER_1K_INPUT_TOKENS_JPY;
  const estimatedOutputCostJpy =
    (estimatedOutputTokens / 1000) * ESTIMATED_COST_PER_1K_OUTPUT_TOKENS_JPY;

  const estimatedCostJpy = Number(
    (estimatedInputCostJpy + estimatedOutputCostJpy).toFixed(6)
  );

  return {
    estimatedInputTokens,
    estimatedOutputTokens,
    estimatedCostJpy,
  };
}

async function recordEstimatedAiUsage(env, estimatedUsage) {
  if (!env.RATE_LIMIT_KV) {
    return;
  }

  const now = new Date();

  await incrementNumericValue(
    env.RATE_LIMIT_KV,
    `cost:moving-assistant:input_tokens:${formatDayWindow(now)}`,
    estimatedUsage.estimatedInputTokens,
    secondsUntilNextDay(now)
  );

  await incrementNumericValue(
    env.RATE_LIMIT_KV,
    `cost:moving-assistant:output_tokens:${formatDayWindow(now)}`,
    estimatedUsage.estimatedOutputTokens,
    secondsUntilNextDay(now)
  );

  await incrementNumericValue(
    env.RATE_LIMIT_KV,
    `cost:moving-assistant:estimated_jpy:${formatDayWindow(now)}`,
    estimatedUsage.estimatedCostJpy,
    secondsUntilNextDay(now)
  );

  await incrementNumericValue(
    env.RATE_LIMIT_KV,
    `cost:moving-assistant:estimated_jpy:${formatMonthWindow(now)}`,
    estimatedUsage.estimatedCostJpy,
    secondsUntilNextMonth(now)
  );
}

async function getEstimatedCost(env, windowType) {
  if (!env.RATE_LIMIT_KV) {
    return 0;
  }

  const now = new Date();
  const suffix = windowType === "month" ? formatMonthWindow(now) : formatDayWindow(now);
  const key = `cost:moving-assistant:estimated_jpy:${suffix}`;
  const currentValue = await env.RATE_LIMIT_KV.get(key);

  return Number.parseFloat(currentValue || "0");
}

async function generateMovingAdviceWithOpenAI(body, env) {
  if (!env.OPENAI_API_KEY) {
    return {
      ok: false,
      reason: "missing_openai_api_key",
    };
  }

  await safeRecordUsage(env, "ai_calls");

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

function extractOpenAIOutputText(responseBody) {
  const output = responseBody?.output;

  if (!Array.isArray(output)) {
    return "";
  }

  const message = output.find((item) => item.type === "message");

  if (!message || !Array.isArray(message.content)) {
    return "";
  }

  const outputText = message.content.find((item) => item.type === "output_text");

  return outputText?.text || "";
}

function buildPrompt(body) {
  const sanitized = FIELD_NAMES.map((fieldName) => {
    const value = body[fieldName];
    return `${fieldName}: ${typeof value === "string" ? value.trim() : ""}`;
  }).join("\n");

  return [
    "以下の引越し情報をもとに、引越し準備を整理してください。",
    "必ずJSONで返してください。",
    "schema: { summary: string, boxEstimate: string, packingMaterials: string[], checklist: string[], riskNotes: string[], disclaimer: string }",
    sanitized,
  ].join("\n");
}

function isValidAiResponse(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return REQUIRED_AI_RESPONSE_FIELDS.every((fieldName) => fieldName in value);
}

function buildFallbackResponse() {
  return {
    summary: "入力内容をもとに、引越し準備のたたき台を作成しました。",
    boxEstimate: "荷物量に応じて、ダンボール・緩衝材・テープを余裕を持って準備してください。",
    packingMaterials: [
      "ダンボール",
      "ガムテープ",
      "緩衝材",
      "油性ペン",
      "ゴミ袋",
    ],
    checklist: [
      "不要品を先に分別する",
      "使用頻度の低いものから梱包する",
      "割れ物や精密機器は緩衝材で保護する",
      "当日使うものは別袋にまとめる",
      "退去前に掃除と忘れ物確認を行う",
    ],
    riskNotes: [
      "大型家具や重量物は、無理に一人で運ばないでください。",
      "貴重品、契約書類、身分証などは手荷物で管理してください。",
    ],
    disclaimer: "この結果は引越し準備の目安です。正式な見積もりや契約条件は、引越し会社・管理会社・勤務先の案内を確認してください。",
  };
}

function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(),
      ...(init.headers || {}),
    },
  });
}

function errorResponse(code, message, status) {
  return jsonResponse(
    {
      error: {
        code,
        message,
      },
    },
    { status }
  );
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Grafana-Webhook-Secret",
  };
}

async function safeRecordUsage(env, metricName) {
  if (!env.RATE_LIMIT_KV) {
    return;
  }

  try {
    const now = new Date();
    const key = `usage:${metricName}:${formatDayWindow(now)}`;
    await incrementCounter(env.RATE_LIMIT_KV, key, secondsUntilNextDay(now));
  } catch (error) {
    console.warn("usage_record_failed", metricName, error?.message || error);
  }
}

async function incrementCounter(kv, key, expirationTtl) {
  const currentValue = await kv.get(key);
  const currentCount = Number.parseInt(currentValue || "0", 10);
  const nextCount = currentCount + 1;
  await kv.put(key, String(nextCount), { expirationTtl });
  return nextCount;
}

async function incrementNumericValue(kv, key, amount, expirationTtl) {
  const currentValue = await kv.get(key);
  const currentAmount = Number.parseFloat(currentValue || "0");
  const nextAmount = currentAmount + amount;
  await kv.put(key, String(nextAmount), { expirationTtl });
  return nextAmount;
}

function secondsUntilNextDay(now) {
  const nextDay = new Date(now);
  nextDay.setUTCHours(24, 0, 0, 0);
  return Math.max(60, Math.floor((nextDay.getTime() - now.getTime()) / 1000));
}

function secondsUntilNextMonth(now) {
  const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return Math.max(60, Math.floor((nextMonth.getTime() - now.getTime()) / 1000));
}

function formatDayWindow(now) {
  return now.toISOString().slice(0, 10);
}

function formatMonthWindow(now) {
  return now.toISOString().slice(0, 7);
}
