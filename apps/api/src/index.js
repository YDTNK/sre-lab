const API_PATH = "/api/moving-assistant";

const MAX_REQUEST_BYTES = 8 * 1024;
const MAX_TOTAL_INPUT_LENGTH = 2000;

const FIELD_NAMES = [
  "furniture",
  "clothes",
  "electronics",
  "books",
  "movingDate",
  "notes",
];

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return handleOptions();
    }

    if (url.pathname !== API_PATH) {
      return errorResponse(
        "not_found",
        "The requested API endpoint was not found.",
        404
      );
    }

    if (request.method !== "POST") {
      return errorResponse(
        "method_not_allowed",
        "Only POST requests are allowed for this endpoint.",
        405
      );
    }

    const contentType = request.headers.get("content-type") || "";

    if (!contentType.toLowerCase().includes("application/json")) {
      return errorResponse(
        "unsupported_media_type",
        "Content-Type must be application/json.",
        415
      );
    }

    const contentLength = request.headers.get("content-length");

    if (contentLength && Number(contentLength) > MAX_REQUEST_BYTES) {
      return errorResponse(
        "payload_too_large",
        "Request body is too large.",
        413
      );
    }

    let bodyText;

    try {
      bodyText = await request.text();
    } catch {
      return errorResponse(
        "invalid_request_body",
        "Failed to read request body.",
        400
      );
    }

    if (bodyText.length > MAX_REQUEST_BYTES) {
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
      return errorResponse(
        "invalid_json",
        "Request body must be valid JSON.",
        400
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
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
      return errorResponse(
        "input_too_large",
        "Total input length is too large.",
        413
      );
    }

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

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: responseHeaders(),
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
    status
  );
}

function responseHeaders() {
  return {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}

function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: responseHeaders(),
  });
}
