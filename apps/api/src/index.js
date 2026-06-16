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
}\n
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
  const response = await fetch(
    `${GITHUB_API_BASE_URL}/repos/${env.GITHUB_REPO}/issues?state=open&labels=${encodeURIComponent(GRAFANA_DEDUPE_LABEL)}&per_page=100`,
    { headers: githubHeaders(env) }
  );

  if (!response.ok) {
    console.warn("github_issue_list_failed", response.status, await response.text());
    return null;
  }

  const issues = await response.json();

  if (!Array.isArray(issues)) {
    return null;
  }

  return issues.find((issue) => {
    return typeof issue.body === "string" && issue.body.includes(dedupeKey);
  }) || null;
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
