const API_BASE_URL = "https://sre-lab-api.daisan-tanaka.workers.dev";

const ENDPOINTS = [
  {
    key: "health",
    path: "/api/health",
    expectedStatus: 200,
    expectedResult: "ok",
    description: "本番稼働確認のPrimary uptime checkです。Availability SLIの中心として扱います。",
  },
  {
    key: "status",
    path: "/api/status",
    expectedStatus: 200,
    expectedResult: "ok",
    description: "サービスの状態、構成、アクティブなエンドポイントを確認するInventory checkです。",
  },
  {
    key: "fallback",
    path: "/api/fallback",
    expectedStatus: 200,
    expectedResult: "ok",
    description: "縮退運転を想定したfallback demoです。200応答でdegraded behaviorを示します。",
  },
  {
    key: "slow",
    path: "/api/slow?delayMs=1000",
    expectedStatus: 200,
    expectedResult: "ok",
    description: "制御された遅延を返すlatency demoです。通常の/health latency SLIとは分けます。",
  },
  {
    key: "error",
    path: "/api/error",
    expectedStatus: 500,
    expectedResult: "expected",
    description: "意図的な500エラーデモです。通常のAvailability計算には含めません。",
  },
];

const stateLabel = document.querySelector("[data-live-overall-state]");
const primarySliLabel = document.querySelector("[data-live-primary-sli]");
const errorDemoLabel = document.querySelector("[data-live-error-demo]");
const checkedAtLabel = document.querySelector("[data-live-checked-at]");
const refreshButton = document.querySelector("[data-live-refresh]");

function formatJstDateTime(date) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Tokyo",
    timeZoneName: "short",
  }).format(date);
}

function setOverallState(state, label) {
  if (!stateLabel) {
    return;
  }

  stateLabel.dataset.liveState = state;
  stateLabel.replaceChildren();

  const dot = document.createElement("span");
  dot.setAttribute("aria-hidden", "true");
  stateLabel.append(dot, ` ${label}`);

  const pulse = document.querySelector("[data-live-pulse]");
  if (pulse) {
    pulse.dataset.livePulse = state;
  }
}

function setMetricState(element, value, state) {
  if (!element) {
    return;
  }

  element.textContent = value;
  element.dataset.livePrimarySli = state;
  element.dataset.liveErrorDemo = state;
}

function getEndpointArticle(key) {
  return document.querySelector(`[data-live-endpoint="${key}"]`);
}

function setEndpointChecking(endpoint) {
  const article = getEndpointArticle(endpoint.key);
  if (!article) {
    return;
  }

  article.dataset.liveResult = "checking";
  const status = article.querySelector("[data-live-status]");
  const latency = article.querySelector("[data-live-latency]");
  const description = article.querySelector("[data-live-description]");

  if (status) {
    status.textContent = "checking";
  }

  if (latency) {
    latency.textContent = "";
  }

  if (description) {
    description.textContent = endpoint.description;
  }
}

function setEndpointResult(endpoint, result) {
  const article = getEndpointArticle(endpoint.key);
  if (!article) {
    return;
  }

  const status = article.querySelector("[data-live-status]");
  const latency = article.querySelector("[data-live-latency]");
  const description = article.querySelector("[data-live-description]");

  article.dataset.liveResult = result.result;

  if (status) {
    status.textContent = result.label;
  }

  if (latency) {
    latency.textContent = Number.isFinite(result.latencyMs)
      ? `${Math.round(result.latencyMs)}ms`
      : "latency unavailable";
  }

  if (description) {
    description.textContent = result.description;
  }
}

async function checkEndpoint(endpoint) {
  const start = performance.now();

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint.path}`, {
      method: "GET",
      cache: "no-store",
    });

    const latencyMs = performance.now() - start;
    const matched = response.status === endpoint.expectedStatus;
    const result = matched ? endpoint.expectedResult : "failed";

    return {
      key: endpoint.key,
      status: response.status,
      latencyMs,
      result,
      label: matched
        ? endpoint.expectedResult === "expected"
          ? `${response.status} expected`
          : `${response.status} ok`
        : `${response.status} failed`,
      description: matched
        ? endpoint.description
        : `期待値 ${endpoint.expectedStatus} に対して ${response.status} を返しました。確認が必要です。`,
    };
  } catch (error) {
    return {
      key: endpoint.key,
      status: null,
      latencyMs: null,
      result: "failed",
      label: "check failed",
      description: "ブラウザからAPIを確認できませんでした。ネットワークまたはCORS設定を確認してください。",
    };
  }
}

async function runLiveChecks() {
  ENDPOINTS.forEach(setEndpointChecking);
  setOverallState("degraded", "Checking...");
  setMetricState(primarySliLabel, "checking", "checking");
  setMetricState(errorDemoLabel, "checking", "checking");

  if (refreshButton) {
    refreshButton.disabled = true;
    refreshButton.textContent = "確認中...";
  }

  const results = await Promise.all(ENDPOINTS.map(checkEndpoint));
  results.forEach((result) => {
    const endpoint = ENDPOINTS.find((item) => item.key === result.key);
    if (endpoint) {
      setEndpointResult(endpoint, result);
    }
  });

  const health = results.find((result) => result.key === "health");
  const errorDemo = results.find((result) => result.key === "error");
  const failed = results.filter((result) => result.result === "failed");
  const availabilityFailures = failed.filter((result) => result.key !== "error");

  if (health?.result === "ok") {
    setMetricState(primarySliLabel, "/health ok", "ok");
  } else {
    setMetricState(primarySliLabel, "/health failed", "failed");
  }

  if (errorDemo?.result === "expected") {
    setMetricState(errorDemoLabel, "500 expected", "expected");
  } else {
    setMetricState(errorDemoLabel, "check failed", "failed");
  }

  if (availabilityFailures.length === 0) {
    setOverallState("operational", "Operational");
  } else {
    setOverallState("degraded", "Check failed");
  }

  if (checkedAtLabel) {
    checkedAtLabel.textContent = `最終確認: ${formatJstDateTime(new Date())}`;
  }

  if (refreshButton) {
    refreshButton.disabled = false;
    refreshButton.textContent = "再チェック";
  }
}

if (refreshButton) {
  refreshButton.addEventListener("click", runLiveChecks);
}

runLiveChecks();
