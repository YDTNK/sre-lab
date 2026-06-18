(() => {
  const form = document.getElementById('movingAssistantForm');
  const result = document.getElementById('result');
  if (!form || !result) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const payload = {
      furniture: read('furniture'),
      clothes: read('clothes'),
      electronics: read('electronics'),
      books: read('books'),
      movingDate: read('movingDate'),
      notes: read('notes')
    };

    const content = [payload.furniture, payload.clothes, payload.electronics, payload.books, payload.notes];
    if (!content.some(Boolean)) {
      showAlert('入力内容を確認してください', '家具・衣類・家電・本や小物・補足情報のうち、最低1項目は入力してください。');
      document.getElementById('furniture')?.focus();
      return;
    }

    if (Object.values(payload).some((value) => value.length > 500)) {
      showAlert('入力内容を確認してください', '各項目は500文字以内で入力してください。');
      return;
    }

    showFallback(payload);
  }, { capture: true });

  function read(id) {
    return document.getElementById(id)?.value.trim() || '';
  }

  function showAlert(title, message) {
    result.innerHTML = `<div class="result-alert" role="alert"><h3>${safe(title)}</h3><p>${safe(message)}</p></div>`;
  }

  function showFallback(payload) {
    const text = Object.values(payload).join(' ').toLowerCase();
    const score = scoreText(text);
    const level = levelText(score);
    const boxes = boxText(level);
    const materials = ['ダンボール S / M サイズ', 'ガムテープまたは養生テープ', '油性ペン', 'ゴミ袋・処分用袋'];
    const tasks = ['荷物を「持っていく / 処分 / 保留」に分ける', '重い物と壊れやすい物を先に洗い出す', '箱ごとに中身と部屋名をメモする', '当日使う物を最後にまとめるバッグを用意する'];
    const risks = ['正式な引越し見積もりではありません', '必要資材は荷物量や業者条件によって変わります', '住所・氏名などの個人情報は入力しないでください'];

    if (has(text, ['食器', '割れ物', 'ガラス', 'モニター', 'pc', 'パソコン'])) materials.push('緩衝材・タオルなどの保護材');
    if (has(text, ['衣類', '服', '布団'])) materials.push('衣類用袋・圧縮袋');
    if (has(text, ['重い', 'ダンベル', '本', '書類'])) risks.push('重い荷物は小さめの箱へ分散してください');
    if (has(text, ['pc', 'パソコン', 'モニター', '楽器', '機材'])) tasks.push('機器類はケーブルや付属品を同じ袋にまとめる');

    result.innerHTML = `
      <div class="result-alert" role="status">
        <h3>簡易診断で表示しています</h3>
        <p>入力内容にもとづく簡易診断です。外部APIに依存せず、見積もり前の準備整理として使えます。</p>
      </div>
      <h3>簡易診断結果</h3>
      <p>入力内容から見ると、荷物量は「${safe(level)}」です。まずは${safe(boxes)}を目安にしてください。</p>
      <h4>ダンボール目安</h4>
      <p>${safe(boxes)}</p>
      <h4>必要な梱包資材</h4>
      ${list(materials)}
      <h4>優先準備タスク</h4>
      ${list(tasks)}
      <h4>注意点</h4>
      ${list(risks)}
      <div class="monetization-cta" aria-label="無料サンプルとPDFテンプレート">
        <p class="status">Next Step</p>
        <h4>時系列チェックリストとPDFテンプレート</h4>
        <p>診断結果とあわせて、無料サンプルやPDFテンプレートで準備を見直せます。</p>
        <div class="hero__actions monetization-cta__actions">
          <a class="button" href="moving-checklist-sample.html">時系列サンプルを見る</a>
          <a class="button button-secondary" href="moving-template.html">PDFテンプレートを見る</a>
        </div>
      </div>
      <h4>注意書き</h4>
      <p>この結果は目安です。実際の必要資材や作業量は条件によって変わります。</p>
    `;
  }

  function scoreText(text) {
    let score = 0;
    ['ベッド', 'デスク', '椅子', '棚', '衣装ケース', '冷蔵庫', '洗濯機', 'モニター', '本', '食器', 'ダンベル', '楽器'].forEach((word) => {
      if (text.includes(word.toLowerCase())) score += 2;
    });
    if (has(text, ['多い', '大量', '3箱', '4箱', '5箱'])) score += 3;
    if (has(text, ['少ない', '少なめ'])) score -= 1;
    return Math.max(0, score);
  }

  function levelText(score) {
    if (score <= 4) return '少なめ';
    if (score <= 8) return '標準';
    if (score <= 12) return '多め';
    return 'かなり多め';
  }

  function boxText(level) {
    if (level === '少なめ') return 'S〜Mサイズ合計5〜8箱程度';
    if (level === '標準') return 'S〜Mサイズ合計8〜12箱程度';
    if (level === '多め') return 'Mサイズ中心で12〜18箱程度';
    return 'M〜Lサイズを含めて18箱以上';
  }

  function has(text, words) {
    return words.some((word) => text.includes(word.toLowerCase()));
  }

  function list(items) {
    return `<ul>${items.map((item) => `<li>${safe(item)}</li>`).join('')}</ul>`;
  }

  function safe(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }
})();
