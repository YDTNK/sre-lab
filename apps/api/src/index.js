export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return handleOptions();
    }

    if (url.pathname !== "/api/moving-assistant") {
      return jsonResponse({ error: "Not found" }, 404);
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const fields = [
      body.furniture,
      body.clothes,
      body.electronics,
      body.books,
      body.movingDate,
      body.notes,
    ];

    const hasAnyInput = fields.some((value) => {
      return typeof value === "string" && value.trim().length > 0;
    });

    if (!hasAnyInput) {
      return jsonResponse(
        { error: "At least one moving information field is required" },
        400
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
        "小物用袋"
      ],
      checklist: [
        "本や重い物は小さめの箱に分けて梱包する",
        "家電や電子機器は緩衝材やタオルで保護する",
        "衣類は衣装ケース・スーツケース・大きめの袋に分類する",
        "搬入経路、エレベーター、駐車スペースを事前確認する",
        "引越し1週間前までに不要品を処分する"
      ],
      riskNotes: [
        "重い物を大きな箱にまとめると運搬時に危険です",
        "電子機器は衝撃と水濡れに注意してください"
      ],
      disclaimer:
        "これはAI引越し診断のモック結果です。正式な引越し業者の見積もりではありません。"
    });
  },
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}
