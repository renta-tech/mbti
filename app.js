// 相性診断ページの画面の動き
(function () {
  const { TYPES, ORDER, result, compat } = window.MBTI;
  const S = window.SITE || {};
  const $ = id => document.getElementById(id);
  const sel = { him: null, you: null };
  let last = null;

  // ───── 計測（GA4のIDが設定されている時だけ送る） ─────
  function track(name, params) {
    try { if (window.gtag) window.gtag('event', name, params || {}); } catch (e) {}
  }
  if (S.gaId) {
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + S.gaId; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', S.gaId);
  }

  // ───── タイプ選択 ─────
  function buildGrid(gridId, who) {
    $(gridId).replaceChildren(...ORDER.map(t => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.dataset.t = t; b.setAttribute('aria-pressed', 'false');
      b.innerHTML = `<b>${t}</b><span>${TYPES[t].name}</span>`;
      b.onclick = () => choose(who, t);
      return b;
    }));
  }
  function choose(who, t) {
    sel[who] = t;
    for (const b of $(who === 'him' ? 'gridHim' : 'gridYou').children) b.setAttribute('aria-pressed', String(b.dataset.t === t));
    $(who + 'Label').textContent = `${t}（${TYPES[t].name}）`;
    $('go').disabled = !(sel.him && sel.you);
  }

  // ───── 結果 ─────
  function showResult(R, isDeep) {
    last = R;
    $('rHim').textContent = `彼 ${R.him}`; $('rYou').textContent = `あなた ${R.you}`;
    $('rlab').textContent = isDeep ? 'ENTP男子との リアルな相性' : 'ふたりの相性';
    $('rtype').textContent = R.name; $('rtag').textContent = R.tag; $('rtext').textContent = R.text;
    $('rvoice').textContent = `${R.him}の本音：${R.voice}`; $('rwarn').textContent = R.warn;
    // ENTPはキャラ、それ以外はタイプの印
    const isEntp = R.him === 'ENTP';
    $('rchara').hidden = !isEntp; $('remb').hidden = isEntp;
    $('remb').textContent = R.him; $('remb').className = 'emb g-' + TYPES[R.him].group;
    $('rtips').replaceChildren(...R.tips.map((tip, n) => { const li = document.createElement('li'); li.innerHTML = `<b>${n + 1}</b><span></span>`; li.querySelector('span').textContent = tip; return li; }));
    const H = TYPES[R.him];
    $('pLove').textContent = H.love; $('pLikes').textContent = H.likes; $('pCools').textContent = H.cools;
    $('pTitle').textContent = `${R.him}（${H.name}）の彼の恋愛傾向`;
    $('deep').hidden = !isEntp || isDeep;
    $('guide').hidden = !isEntp;
    renderPr();
    const tag = isDeep ? `ENTP男子とのリアルな相性は${R.pct}%` : `彼${R.him}×わたし${R.you}の相性は${R.pct}%`;
    $('shareText').textContent = `${tag}「${R.name}」だった！ #MBTI相性 #${R.him} #${R.you}`;
    $('pairLink').href = `pair/${R.him.toLowerCase()}-${R.you.toLowerCase()}/`;
    $('cardImg').hidden = true; $('cardNote').hidden = true; $('cardSave').hidden = true;
    show('vR');
    track('result', { him: R.him, you: R.you, pct: R.pct, deep: !!isDeep });
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { $('pct').textContent = R.pct; return; }
    const t0 = performance.now();
    (function tick(now) { const k = Math.min(1, (now - t0) / 900); $('pct').textContent = Math.round(R.pct * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); })(t0);
  }

  // ───── シェア画像 ─────
  async function makeCard() {
    try { await Promise.all([document.fonts.load('400 60px "Dela Gothic One"'), document.fonts.load('900 40px "Zen Kaku Gothic New"')]); } catch (e) {}
    const cv = document.createElement('canvas');
    window.MBTICard.drawStory(cv, last, S.url ? S.url.replace(/^https?:\/\//, '') : '');
    const url = cv.toDataURL('image/png');
    $('cardImg').src = url; $('cardImg').hidden = false; $('cardNote').hidden = false;
    $('cardSave').href = url; $('cardSave').download = `mbti-${last.him}-${last.you}.png`; $('cardSave').hidden = false;
    track('make_card', { him: last.him, you: last.you });
  }

  // ───── タイプ推定（4問） ─────
  const EST = [
    { q: ['休みの日、元気が回復するのは？', '休みの日、彼が元気になるのは？'], a: [['人と会って出かける', 'E'], ['ひとりでゆっくり', 'I']] },
    { q: ['話していて楽しいのは？', '彼が楽しそうに話すのは？'], a: [['もしも話、将来、アイデアの話', 'N'], ['今日あったこと、具体的な話', 'S']] },
    { q: ['友達に相談されたら、まず？', '相談された時、彼はまず？'], a: [['解決策を考える', 'T'], ['気持ちに寄り添う', 'F']] },
    { q: ['旅行の計画は？', '彼の旅行の計画は？'], a: [['しっかり決めたい', 'J'], ['行ってから決めたい', 'P']] },
  ];
  let estWho = null, estI = 0, estAns = [];
  function startEst(who) { estWho = who; estI = 0; estAns = []; renderEst(); show('vEst'); }
  function renderEst() {
    const it = EST[estI];
    $('eno').textContent = `${estWho === 'him' ? '彼' : 'あなた'}のタイプ推定 ${estI + 1} / 4`;
    $('eprog').style.width = (estI / 4 * 100) + '%';
    $('etext').textContent = it.q[estWho === 'him' ? 1 : 0];
    $('eopts').replaceChildren(...it.a.map(([label, letter]) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.textContent = label;
      b.onclick = () => { estAns[estI] = letter; estI++; if (estI < 4) renderEst(); else { choose(estWho, estAns.join('')); show('vStart'); track('estimate', { who: estWho }); } };
      return b;
    }));
  }

  // ───── ENTP専用の深掘り（8問） ─────
  const Q = window.ENTP_DEEP.Q, DEEP = window.ENTP_DEEP.TYPES;
  let i = 0; const picks = [];
  function renderQ() {
    const item = Q[i];
    $('qno').textContent = `ENTP専用 Q${i + 1} / ${Q.length}`;
    $('prog').style.width = (i / Q.length * 100) + '%';
    $('qtext').textContent = item.q;
    $('opts').replaceChildren(...item.a.map(([label], k) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.textContent = label;
      b.onclick = () => { picks[i] = k; i++; i < Q.length ? renderQ() : finishDeep(); };
      return b;
    }));
    $('back').hidden = i === 0;
  }
  function finishDeep() {
    const s = { spark: 0, free: 0, curious: 0, humor: 0, direct: 0 };
    picks.forEach((k, n) => { for (const [key, v] of Object.entries(Q[n].a[k][1])) s[key] += v; });
    const w = { spark: 1.2, free: 1.2, curious: 1.1, humor: 1, direct: .8 };
    const raw = Object.keys(s).reduce((a, k) => a + s[k] * w[k], 0);
    const typePct = compat('ENTP', sel.you).pct;       // タイプ相性4割・行動6割
    const pct = Math.max(38, Math.min(98, Math.round((64 + raw * 1.6) * .6 + typePct * .4)));
    const t = DEEP.find(t => pct >= t.min);
    showResult({ him: 'ENTP', you: sel.you, pct, name: t.name, tag: t.tag, text: 'ふたりのタイプの相性に、あなたの答えから見えた「付き合い方のクセ」を合わせた結果です。',
      voice: t.voice, tips: t.tips, warn: t.warn }, true);
  }

  // ───── 画面切り替え・初期化 ─────
  function show(v) { for (const id of ['vStart', 'vEst', 'vQ', 'vR']) $(id).hidden = id !== v; window.scrollTo(0, 0); }
  buildGrid('gridHim', 'him'); buildGrid('gridYou', 'you');
  // ?him=ENTP&you=INFJ、または #entp で開いた時は選んだ状態にする
  const qs = new URLSearchParams(location.search);
  const h0 = (qs.get('him') || location.hash.slice(1)).toUpperCase(), y0 = (qs.get('you') || '').toUpperCase();
  if (TYPES[h0]) choose('him', h0);
  if (TYPES[y0]) choose('you', y0);
  if (TYPES[h0] && TYPES[y0] && qs.get('show') === '1') showResult(result(h0, y0), false);
  for (const b of document.querySelectorAll('[data-est]')) b.onclick = () => startEst(b.dataset.est);
  $('ecancel').onclick = () => show('vStart');
  $('go').onclick = () => showResult(result(sel.him, sel.you), false);
  $('goDeep').onclick = () => { i = 0; picks.length = 0; renderQ(); show('vQ'); track('deep_start', { you: sel.you }); };
  $('back').onclick = () => { if (i > 0) { i--; renderQ(); } };
  $('again').onclick = () => show('vStart');
  $('makeCard').onclick = makeCard;
  $('copy').onclick = () => {
    const txt = $('shareText').textContent;
    const done = () => { $('copy').textContent = 'コピーしました'; setTimeout(() => $('copy').textContent = 'シェア用の文をコピー', 1800); };
    try { navigator.clipboard.writeText(txt).then(done, selectText); } catch (e) { selectText(); }
    track('copy_share', {});
  };
  function selectText() { const r = document.createRange(); r.selectNodeContents($('shareText')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); $('copy').textContent = '文を選択しました。コピーしてね'; }
  // 出口：PR枠は config.js の prList にURLを入れた案件だけ表示する
  function renderPr() {
    const box = $('prList'); box.replaceChildren();
    for (const it of (S.prList || []).filter(x => x.url)) {
      const d = document.createElement('div'); d.className = 'exit pr';
      const k = document.createElement('div'); k.className = 'k'; k.textContent = 'PR（広告）';
      const h = document.createElement('h3'); h.textContent = it.title;
      const p = document.createElement('p'); p.textContent = it.desc;
      const a = document.createElement('a'); a.className = 'btn'; a.href = it.url; a.target = '_blank'; a.rel = 'sponsored nofollow noopener'; a.textContent = it.btn;
      a.addEventListener('click', () => track('click_pr', { key: it.key, him: last && last.him, you: last && last.you }));
      const n = document.createElement('div'); n.className = 'slot'; n.textContent = `提供：${it.name}`;
      d.append(k, h, p, a, n); box.appendChild(d);
    }
  }
  const gd = $('guideLink');
  if (S.guideUrl) { gd.href = S.guideUrl; gd.target = '_blank'; gd.rel = 'noopener'; gd.textContent = 'ガイドを読む（note）'; } else gd.addEventListener('click', e => e.preventDefault());
  gd.addEventListener('click', () => track('click_guide', {}));
})();
