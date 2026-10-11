// 結果カード画像を描く（シェア用 1080x1920 / リンクのプレビュー用 1200x630）
(function (root) {
  const GROUP_COLOR = { NT: '#7b2fbe', NF: '#2f9e6b', SJ: '#2f6fbe', SP: '#d98a1a' };
  const DISPLAY = '"Dela Gothic One", "Hiragino Sans", sans-serif';
  const BODY = '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans JP", Meiryo, sans-serif';

  function fit(ctx, text, maxW, size, weight, font) {
    let s = size;
    ctx.font = `${weight} ${s}px ${font}`;
    while (ctx.measureText(text).width > maxW && s > 10) { s -= 2; ctx.font = `${weight} ${s}px ${font}`; }
    return s;
  }
  function wrap(ctx, text, maxW) {
    const lines = []; let cur = '';
    for (const ch of text) { if (ctx.measureText(cur + ch).width > maxW && cur) { lines.push(cur); cur = ch; } else cur += ch; }
    if (cur) lines.push(cur);
    return lines;
  }
  function emblem(ctx, cx, cy, r, type) {
    const g = root.MBTI.TYPES[type].group;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = GROUP_COLOR[g]; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    fit(ctx, type, r * 1.55, r * .62, 400, DISPLAY); ctx.fillText(type, cx, cy + r * .02);
  }

  // story: 縦長シェア画像
  function drawStory(canvas, R, site) {
    const W = 1080, H = 1920; canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    const gr = ctx.createRadialGradient(W / 2, 760, 50, W / 2, 760, 900);
    gr.addColorStop(0, '#f4ecfd'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#7b2fbe'; ctx.font = `400 64px ${DISPLAY}`; ctx.fillText('MBTI相性診断', W / 2, 250);
    emblem(ctx, W / 2 - 230, 470, 120, R.him); emblem(ctx, W / 2 + 230, 470, 120, R.you);
    ctx.fillStyle = '#5e566a'; ctx.font = `900 40px ${BODY}`; ctx.textBaseline = 'middle'; ctx.fillText('×', W / 2, 470);
    ctx.font = `900 34px ${BODY}`; ctx.fillText('彼', W / 2 - 230, 635); ctx.fillText('わたし', W / 2 + 230, 635);
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#7b2fbe'; ctx.textAlign = 'left';
    ctx.font = `400 300px ${DISPLAY}`; const nw = ctx.measureText(String(R.pct)).width;
    ctx.font = `400 120px ${DISPLAY}`; const pw = ctx.measureText('%').width;
    const x0 = W / 2 - (nw + pw + 10) / 2;
    ctx.font = `400 300px ${DISPLAY}`; ctx.fillText(String(R.pct), x0, 1010);
    ctx.font = `400 120px ${DISPLAY}`; ctx.fillText('%', x0 + nw + 10, 1010);
    ctx.textAlign = 'center'; ctx.fillStyle = '#1b1622';
    fit(ctx, R.name, 940, 70, 400, DISPLAY); ctx.fillText(R.name, W / 2, 1150);
    ctx.fillStyle = '#ebddfb'; const tw = 360; ctx.beginPath(); ctx.roundRect(W / 2 - tw / 2, 1195, tw, 70, 35); ctx.fill();
    ctx.fillStyle = '#7b2fbe'; ctx.font = `900 36px ${BODY}`; ctx.fillText(R.tag, W / 2, 1243);
    // コツを1つだけ
    ctx.fillStyle = '#1b1622'; ctx.font = `700 40px ${BODY}`; ctx.textAlign = 'left';
    let ly = 1380;
    for (const tip of R.tips.slice(0, 2)) {
      const lines = wrap(ctx, '・' + tip, 860).slice(0, 3);
      lines.forEach((l, i) => ctx.fillText(l, 110, ly + i * 58));
      ly += lines.length * 58 + 26;
    }
    ctx.textAlign = 'center'; ctx.fillStyle = '#5e566a'; ctx.font = `700 36px ${BODY}`;
    ctx.fillText('あなたたちの相性も診断してみて', W / 2, 1720);
    ctx.fillStyle = '#7b2fbe'; ctx.font = `900 40px ${BODY}`; ctx.fillText(site || 'TikTok @entp0341 のプロフィールから', W / 2, 1785);
  }
  // og: リンクを貼った時のプレビュー画像
  function drawOg(canvas, R) {
    const W = 1200, H = 630; canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#f4ecfd'; ctx.fillRect(0, 0, 420, H);
    emblem(ctx, 210, 200, 110, R.him); emblem(ctx, 210, 450, 110, R.you);
    ctx.fillStyle = '#5e566a'; ctx.font = `900 34px ${BODY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('×', 210, 326);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#7b2fbe'; ctx.font = `400 40px ${DISPLAY}`; ctx.fillText('MBTI相性診断', 480, 110);
    ctx.fillStyle = '#1b1622'; ctx.font = `900 40px ${BODY}`; ctx.fillText(`彼 ${R.him} × あなた ${R.you}`, 480, 185);
    ctx.fillStyle = '#7b2fbe'; ctx.font = `400 190px ${DISPLAY}`; ctx.fillText(R.pct + '%', 470, 400);
    ctx.fillStyle = '#1b1622'; fit(ctx, R.name, 680, 48, 400, DISPLAY); ctx.fillText(R.name, 480, 490);
    ctx.fillStyle = '#5e566a'; ctx.font = `700 30px ${BODY}`; ctx.fillText(R.tag + '｜うまくいく接し方つき', 480, 555);
  }
  root.MBTICard = { drawStory, drawOg, GROUP_COLOR };
})(typeof window !== 'undefined' ? window : globalThis);
