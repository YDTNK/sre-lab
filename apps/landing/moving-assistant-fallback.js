(() => {
  const form = document.getElementById("movingAssistantForm");
  const result = document.getElementById("result");
  if (!form || !result) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    result.innerHTML = '<div class="result-alert" role="status"><h3>簡易診断で表示しています</h3><p>入力内容にもとづく簡易診断を表示します。</p></div>';
  }, { capture: true });
})();
