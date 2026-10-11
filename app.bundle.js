// MBTI相性診断のデータと計算（ブラウザとビルド用スクリプトの両方で使う）
(function (root) {
  // ───── 16タイプ（彼として見た時のプロフィール） ─────
  const TYPES = {
    INTJ: { name: '戦略家', group: 'NT',
      love: '好きな人にも計画的。軽いノリより、話が通じる相手を長く大事にします。',
      likes: '自分の考えを最後まで聞いてくれること', cools: '感情だけで責められること',
      voice: '口数は少ないけど、決めた相手のことはずっと考えてる。' },
    INTP: { name: '理屈屋', group: 'NT',
      love: '恋愛でも頭の中で考えすぎるタイプ。気づいた時にはかなり好きになっています。',
      likes: '変な話を面白がってくれること', cools: '答えを急かされること',
      voice: '返信が遅いのは、何て返すか考えすぎてるだけ。' },
    ENTJ: { name: '司令塔', group: 'NT',
      love: '好きになったら行動が早い。相手の人生ごと応援したくなるタイプです。',
      likes: '自分の目標を持っている人', cools: 'はっきりしない態度',
      voice: '頼られると燃える。でも本当は、こっちも頼りたい時がある。' },
    ENTP: { name: '論破王', group: 'NT',
      love: 'ふざけながら距離を詰めるタイプ。からかうのは、気になっているサインです。',
      likes: '言い返してくれること、面白がってくれること', cools: '束縛と、話が広がらないこと',
      voice: '言い返してくれる人、正直いちばん気になります。' },
    INFJ: { name: '見抜く人', group: 'NF',
      love: '相手の本音まで感じ取るタイプ。心を許すまでは時間がかかりますが、許したら一途です。',
      likes: '深い話ができること', cools: '表と裏がある態度',
      voice: '平気なふりがうまいだけで、本当はちゃんと傷ついてる。' },
    INFP: { name: '夢見る人', group: 'NF',
      love: '理想の恋をずっと心に持っているタイプ。優しさの中に、こだわりの強さがあります。',
      likes: '自分の世界観を否定しないこと', cools: '気持ちを雑に扱われること',
      voice: '好きな人の何気ない一言を、何日も覚えてる。' },
    ENFJ: { name: '世話焼き', group: 'NF',
      love: '相手を幸せにしたい気持ちが強いタイプ。尽くすぶん、反応がないと不安になります。',
      likes: '「ありがとう」をちゃんと言ってくれること', cools: '気持ちを受け取ってもらえないこと',
      voice: 'みんなに優しいけど、特別扱いしてるのは一人だけ。' },
    ENFP: { name: '自由人', group: 'NF',
      love: '好きになると全力で楽しませにくるタイプ。テンションの波も含めて素直です。',
      likes: '一緒にはしゃいでくれること', cools: 'ノリを否定されること',
      voice: '楽しそうに見えて、実はけっこう相手の反応を気にしてる。' },
    ISTJ: { name: 'しっかり者', group: 'SJ',
      love: '言葉より約束を守ることで愛情を示すタイプ。派手さはないけど、裏切りません。',
      likes: '時間や約束をきちんと守ること', cools: '予定を急に変えられること',
      voice: '毎日同じ時間に連絡するのが、俺なりの好きのサイン。' },
    ISFJ: { name: '守る人', group: 'SJ',
      love: '相手の小さな変化に気づいて、そっと支えるタイプ。尽くし上手です。',
      likes: '気づかいに気づいてくれること', cools: '雑な扱いをされること',
      voice: '覚えてるよ、前に好きって言ってたあれ。' },
    ESTJ: { name: '仕切り屋', group: 'SJ',
      love: '頼れる存在でいたいタイプ。将来のことも現実的に考えてくれます。',
      likes: 'はっきり意見を言ってくれること', cools: 'ルーズさ',
      voice: '口うるさいのは、ちゃんと大事にしたいからだよ。' },
    ESFJ: { name: '気配りさん', group: 'SJ',
      love: '相手を喜ばせるのが好きなタイプ。記念日やイベントを大切にします。',
      likes: '一緒の時間を大事にしてくれること', cools: '冷たい反応',
      voice: '既読スルーされると、ちょっとだけ落ち込む。' },
    ISTP: { name: '職人', group: 'SP',
      love: '言葉は少なめ、でも行動で示すタイプ。干渉されない関係が心地いい人です。',
      likes: '自分のペースを尊重してくれること', cools: '細かく詮索されること',
      voice: '黙ってるのは怒ってるんじゃなくて、普通にくつろいでる。' },
    ISFP: { name: '感性の人', group: 'SP',
      love: '穏やかで優しいタイプ。好きな人とは、言葉より空気で通じ合いたい人です。',
      likes: '自分の好きなものを一緒に楽しんでくれること', cools: '強く否定されること',
      voice: '一緒にいて落ち着く人が、いちばん好き。' },
    ESTP: { name: '行動派', group: 'SP',
      love: '好きになったら即行動のタイプ。一緒に楽しめるかを何より大事にします。',
      likes: 'ノリよく付き合ってくれること', cools: '重すぎる空気',
      voice: '会いたい時は会いたいって言う。それでよくない？' },
    ESFP: { name: '盛り上げ役', group: 'SP',
      love: '一緒にいる時間を全力で楽しむタイプ。愛情表現もストレートです。',
      likes: '一緒に笑ってくれること', cools: 'ノリが悪いと思われること',
      voice: '楽しいことは、好きな人と全部やりたい。' },
  };
  const ORDER = Object.keys(TYPES);
  const GROUP_NAME = { NT: '分析家', NF: '理想家', SJ: '守護者', SP: '探検家' };

  // ───── 彼がENTPの時の16通り（手書き） ─────
  const ENTP_PAIRS = {
    INTJ: { name: '頭脳で惹かれ合う 最強参謀ペア', text: '議論のレベルが合う数少ない相手。ENTPのアイデアをINTJが形にする、仕事でも恋愛でも強いふたりです。',
      tips: ['彼の思いつきを「で、どうやる？」と現実に引き戻すと、尊敬されます', '議論はとことん。言い負かされても根に持たないのが長続きのコツ', '彼の気まぐれな予定変更は、7割くらい受け流すくらいがちょうどいい'],
      warn: 'どちらも素直に「好き」を言わないタイプ。たまには理屈抜きで気持ちを言葉にして。' },
    INTP: { name: '話が終わらない 深夜トークペア', text: '気づいたら朝まで話しているふたり。ENTPの発想をINTPが深掘りして、会話がどこまでも広がります。',
      tips: ['彼の雑談に、あなたの「でもさ」をぶつけると喜ばれます', 'デートは考えすぎずに、彼に連れ出してもらう方がうまくいきます', '連絡の頻度より、会った時の会話の濃さを大事に'],
      warn: 'どちらも現実の段取りが苦手。大事な予定だけはその場で決めてしまって。' },
    ENTJ: { name: '火花が散る ライバルペア', text: '負けず嫌い同士。ぶつかるけど、ぶつかるほど刺激になって成長できる関係です。',
      tips: ['意見がぶつかったら、勝ち負けより「どっちが面白いか」で決めると平和です', '彼のアイデアを本気で実行してみると、一気に距離が縮まります', 'たまには主導権を渡して、彼に振り回されてあげて'],
      warn: 'どちらも引かないので、ケンカが長引きがち。先に笑った方が勝ち、くらいの気持ちで。' },
    ENTP: { name: '最強に楽しい 似た者ペア', text: 'ノリも思考回路もそっくり。一緒にいて退屈する瞬間がないふたりです。',
      tips: ['ふたりの「くだらない企画」は全部やってみて。思い出がどんどん増えます', '言い合いは楽しめるけど、相手の本気の話は茶化さずに聞いて', '面倒な家事や手続きは、当番を決めてしまうのが平和'],
      warn: 'どちらも飽きっぽいので、刺激がないと離れがち。新しいことを一緒に始め続けて。' },
    INFJ: { name: '心の奥でつながる 運命ペア', text: 'MBTIで「最高の相性」と言われる組み合わせ。ENTPの軽さの奥にある本音を、INFJだけが見抜けます。',
      tips: ['彼のふざけた言葉の裏にある本音を、そっと拾ってあげて', '深い話を振ると、彼は普段見せない真面目な顔を見せます', '疲れた時は「今日は静かにいたい」と言えばOK。彼はちゃんと分かってくれます'],
      warn: '彼の議論好きが、あなたには攻撃に聞こえる時も。悪気はないので「今のはちょっと痛い」と伝えて。' },
    INFP: { name: '想像が広がる 夢語りペア', text: 'ENTPのアイデアとINFPの世界観が混ざると、話がどんどん広がる。お互いの「好き」を否定しないふたりです。',
      tips: ['あなたの好きなもの、彼に全力で語ってみて。面白がってくれます', '彼の冗談がきつい時は、その場で「それはやだ」と言って大丈夫', '計画は彼に任せず、ふたりで一緒に決めると安心です'],
      warn: '彼の正論は、あなたの気持ちを置き去りにしがち。気持ちの話をしたい時は、最初にそう言って。' },
    ENFJ: { name: '引っ張り合う 化学反応ペア', text: 'ENFJの包容力が、ENTPの自由さを受け止める組み合わせ。周りから見てもお似合いのふたりです。',
      tips: ['彼のアイデアに「いいね、やろう」と乗ると、一気に信頼されます', '尽くしすぎず、あなたもやりたいことを言ってOK', '彼が考え込んでいる時は、そっとしておくのが正解'],
      warn: 'あなたが尽くしても、彼は気づかないことがあります。言葉で「うれしかった」を伝え合って。' },
    ENFP: { name: 'ノリが合う 最強友達ペア', text: '出会った瞬間から話が弾むふたり。友達みたいな恋人になれる相性です。',
      tips: ['思いつきの旅行やイベント、どんどん行って', 'ふざけ合いの中に、たまに本気の「好き」を混ぜると効きます', 'お金や将来の話は、テンションが落ち着いた日にまとめてしておいて'],
      warn: 'どちらも気分屋。テンションが下がった日は、無理に盛り上げずに放っておくのも優しさです。' },
    ISTJ: { name: '正反対だから補える 凸凹ペア', text: '考え方はほぼ真逆。でも、ENTPの自由さとISTJの安定感がうまくかみ合えば、最強の凸凹コンビです。',
      tips: ['彼のアイデアに「面白い。でも期限決めよう」と返すと、いいチームになります', '彼の気まぐれは「いつものことだ」と笑って流せると楽です', 'あなたのルールは、理由と一緒に伝えると彼も守ります'],
      warn: '予定変更が一番のケンカの種。変更していい予定と、絶対守る予定を分けておいて。' },
    ISFJ: { name: '支え支えられる 安心ペア', text: '自由なENTPを、ISFJの優しさが包む組み合わせ。彼にとって帰る場所になれる相性です。',
      tips: ['彼が挑戦したい時は「いいね」と背中を押してあげて', 'あなたの気づかいは、言葉にしないと彼は気づきません。たまに「これやったよ」と言ってOK', '彼の議論には、無理に勝とうとせず「なんでそう思うの？」と質問を'],
      warn: '彼のからかいが本気に聞こえる時は、我慢せず伝えて。彼は言われれば直します。' },
    ESTJ: { name: 'ぶつかって育つ 本音ペア', text: 'どちらも言いたいことを言うタイプ。衝突はあるけど、隠し事のない関係になれます。',
      tips: ['彼の思いつきに、あなたの実行力が加わると何でも形になります', '言い合いになったら、ルールより「何をしたいか」で話すとまとまります', '彼にも役割を任せると、意外と責任感を見せます'],
      warn: 'あなたの正しさで彼を縛ると、彼は逃げたくなります。自由にしていい範囲を決めてあげて。' },
    ESFJ: { name: '世界を広げ合う 社交ペア', text: 'どちらも人と関わるのが好き。ESFJの気配りとENTPの話術で、ふたりの周りはいつもにぎやかです。',
      tips: ['友達を交えて遊ぶと、彼のいい面がたくさん見られます', '記念日は「何がしたいか」をあなたから伝えると、彼も全力で応えます', '彼の冗談に本気で傷ついたら、その場で言うのが一番'],
      warn: '彼は空気より面白さを優先しがち。人前での失言は、あとでふたりで話して。' },
    ISTP: { name: 'ほどよい距離の クールペア', text: 'べたべたしないけど、お互いを認め合う関係。一緒にいても疲れない、大人っぽい相性です。',
      tips: ['彼の長話は、気になるところだけ拾えば十分です', '一緒に何かを作ったり、体験したりするデートがハマります', '連絡が少ない日が続いても、お互い気にしなくてOK'],
      warn: '気持ちを言葉にしないまま時間がたちがち。月に一度は「最近どう？」と聞き合って。' },
    ISFP: { name: '刺激と癒しの 補い合いペア', text: 'ENTPの刺激とISFPの穏やかさが、ちょうどいいバランスになる組み合わせ。彼はあなたといると落ち着きます。',
      tips: ['あなたの好きな場所に、彼を連れて行ってあげて', '彼の議論が強すぎる時は「今は話を聞いてほしい」と言ってOK', '言葉より、さりげないプレゼントや手紙が彼の心に残ります'],
      warn: '彼のペースに合わせすぎると疲れてしまいます。あなたのペースも大事にして。' },
    ESTP: { name: '毎日がイベントの 冒険ペア', text: '思い立ったら即行動のふたり。一緒にいれば、退屈とは無縁の毎日です。',
      tips: ['気になる場所は、その日のうちに行ってみて', '彼の理屈っぽい話は、あなたの「やってみればわかる」で解決します', '勢いで決めたことの後片づけは、交代制に'],
      warn: 'どちらも先のことを考えるのが苦手。お金と予定の話だけは、落ち着いてする日を作って。' },
    ESFP: { name: '笑いが絶えない パーティーペア', text: '一緒にいるだけで場が明るくなるふたり。ENTPの話術とESFPのノリで、どこでも盛り上がれます。',
      tips: ['ふたりでイベントや旅行を企画すると最高に楽しい', '彼の深い話に、あなたが素直なリアクションを返すと喜ばれます', 'たまにはふたりだけで、静かに話す時間も作って'],
      warn: '楽しいことを優先しすぎて、大事な話を後回しにしがち。真面目な話をする合図を決めておいて。' },
  };

  // ───── 相性の計算：文字ごとのルール＋定番ペアの加点＋組み合わせごとの小さな個性 ─────
  function compat(h, y) {
    const same = k => h[k] === y[k];
    let p = 36;
    p += same(0) ? 6 : 9;          // E/I：違う方が補い合う
    p += same(1) ? 15 : 1;         // N/S：見え方が同じだと会話が合う（最重要）
    p += same(2) ? 6 : 9;          // T/F：違う方が補い合う
    p += same(3) ? 5 : 9;          // J/P：違う方が役割分担できる
    const golden = same(1) && !same(0) && !same(3);
    if (golden) p += 8;
    let hsh = 0; for (const c of h + y) hsh = (hsh * 31 + c.charCodeAt(0)) % 997;
    p += hsh % 6;
    return { pct: Math.max(42, Math.min(97, p)), golden };
  }
  function pairType(h, y, golden) {
    const sameCount = [0, 1, 2, 3].filter(k => h[k] === y[k]).length;
    if (golden) return { name: '補い合う 運命ペア', tag: '最高の相性' };
    if (h === y) return { name: '鏡みたいな そっくりペア', tag: '分かり合える相性' };
    if (h[1] === y[1] && h[1] === 'N') return { name: '話が尽きない 知的ペア', tag: sameCount >= 3 ? 'かなり良い相性' : '良い相性' };
    if (h[1] === y[1]) return { name: 'テンポが合う 堅実ペア', tag: sameCount >= 3 ? 'かなり良い相性' : '良い相性' };
    return { name: '見えてる世界が違う 刺激ペア', tag: '工夫で伸びる相性' };
  }
  function tipsFor(h, y) {
    const t = [];
    if (h[1] !== y[1]) t.push(h[1] === 'N' ? '彼は結論や「もしも」の話が好き。具体的な話は、最初に結論を言うと届きます' : '彼は具体的な話が安心するタイプ。ふわっとした話は、例を添えると伝わります');
    else t.push(h[1] === 'N' ? '将来の話や妄想の話で一番盛り上がれるふたり。くだらない「もしも」話を楽しんで' : '予定や現実的な話がすっと通じるふたり。小さな約束を積み重ねると安定します');
    if (h[2] !== y[2]) t.push(h[2] === 'T' ? '彼は理屈で考えるタイプ。気持ちを伝える時は「なぜそう思うか」を一言添えて' : '彼は気持ちを大事にするタイプ。正論より先に「わかるよ」を');
    else t.push(h[2] === 'T' ? 'ふたりとも理屈派。議論は楽しめるけど、たまに気持ちも言葉にして' : 'ふたりとも気持ち派。言いにくいことを溜めないのがコツ');
    if (h[3] !== y[3]) t.push(h[3] === 'J' ? '計画は彼に任せて、当日のアレンジはあなたが。役割分担がハマります' : '段取りはあなたが少しリードして、遊びの部分は彼に任せて');
    else t.push(h[3] === 'J' ? 'ふたりとも計画派。予定通りの安心感はあるので、たまに予定外の寄り道を' : 'ふたりとも気分派。自由で楽しい反面、大事な約束だけは決めておいて');
    return t;
  }
  function warnFor(h, y) {
    if (h[0] !== y[0]) return h[0] === 'E' ? '彼は外に出て元気になるタイプ。あなたが疲れた日は、無理に合わせず「今日は家がいい」と言ってOK。' : '彼は一人の時間で回復するタイプ。連絡が少ない日は、嫌われたわけじゃなく充電中です。';
    if (h[0] === 'E') return 'ふたりとも予定を詰めがち。何もしない日を作ると、関係が長持ちします。';
    return 'ふたりとも内にこもりがち。気持ちは言わないと伝わらないので、短くても言葉にして。';
  }
  // 相性の中身を4つの観点で見せる（エンタメ用の目安。各観点はタイプの文字の一致・不一致から決める）
  function meters(h, y) {
    const same = k => h[k] === y[k];
    let j = 0; for (const c of h + y) j = (j * 17 + c.charCodeAt(0)) % 101;
    const jit = n => ((j * (n + 3)) % 13) - 6;
    const cl = v => Math.max(36, Math.min(96, Math.round(v)));
    return [
      { label: '会話のかみ合い', v: cl((same(1) ? 82 : 52) + (same(0) ? 4 : 0) + jit(1)) },
      { label: 'ワクワク感', v: cl(40 + (same(0) ? 0 : 18) + (same(3) ? 0 : 18) + (same(2) ? 0 : 12) + jit(2)) },
      { label: '安心感', v: cl(42 + (same(3) ? 18 : 0) + (same(2) ? 14 : 0) + (same(0) ? 10 : 0) + (same(1) ? 8 : 0) + jit(3)) },
      { label: '気持ちの伝わりやすさ', v: cl(40 + (same(2) ? 24 : 0) + (same(1) ? 16 : 0) + (same(3) ? 8 : 0) + jit(4)) },
    ];
  }
  const ICONS = {
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    alert: '<path d="M12 3 2.5 20h19L12 3zM12 10v4.5M12 17.2v.1"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    chat: '<path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9.5h8M8 12.5h5"/>',
    camera: '<path d="M3 8h4l2-3h6l2 3h4v11H3V8z"/><circle cx="12" cy="13" r="3.5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"/>',
  };
  const icon = (n, sz) => `<svg class="ic" width="${sz || 22}" height="${sz || 22}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  // 1組分の結果をまとめて返す（ページ生成・アプリの両方で使う）
  function result(h, y) {
    const c = compat(h, y);
    const base = pairType(h, y, c.golden);
    const H = TYPES[h], Y = TYPES[y];
    const hand = h === 'ENTP' ? ENTP_PAIRS[y] : null;
    const tips = hand ? hand.tips : tipsFor(h, y);
    // 自動生成の組み合わせにも、彼のタイプ固有の一文を必ず混ぜる
    if (!hand) tips.unshift(`${h}の彼が喜ぶのは「${H.likes}」。逆に「${H.cools}」は冷める原因になります`);
    return {
      him: h, you: y, pct: c.pct, golden: c.golden,
      name: hand ? hand.name : base.name, tag: base.tag,
      text: hand ? hand.text : `${h}（${H.name}）の彼と、${y}（${Y.name}）のあなた。${H.love}`,
      voice: H.voice, tips: tips.slice(0, 3), warn: hand ? hand.warn : warnFor(h, y), meters: meters(h, y),
      handWritten: !!hand,
    };
  }

  root.MBTI = { TYPES, ORDER, GROUP_NAME, ENTP_PAIRS, compat, pairType, tipsFor, warnFor, meters, icon, ICONS, result };
})(typeof window !== 'undefined' ? window : globalThis);

;
// 彼がENTPの時だけの深掘り診断（8問）
(function(){
const Q = [
  { q: '彼が急に、あなたの意見に反対してきた。どうする？', a: [
    ['え、なんで？と理由を聞いて言い返す', { spark: 3, curious: 1 }],
    ['ちょっとムッとするけど、面白いから乗る', { spark: 2, humor: 1 }],
    ['ケンカしたくないから引く', { spark: -1 }],
    ['普通に傷つく', { spark: -2, direct: 1 }] ] },
  { q: '3日くらいLINEが返ってこない。', a: [
    ['なんか夢中になってるんだろうな、で終わり', { free: 3 }],
    ['気にはなるけど、自分も好きに過ごす', { free: 2 }],
    ['「生きてる？」とだけ送る', { free: 1, humor: 1 }],
    ['不安で何回か送っちゃう', { free: -2 }] ] },
  { q: '彼が「ちょっと思いついたんだけど」と、謎の話を始めた。', a: [
    ['大好物。どこまでも付き合う', { curious: 3 }],
    ['よく分からないけど、楽しそうだから聞く', { curious: 2, humor: 1 }],
    ['その話、いま必要？と思う', { curious: -1, direct: 1 }],
    ['正直ちょっと疲れる', { curious: -2 }] ] },
  { q: 'デートの予定、どう決めたい？', a: [
    ['当日のノリで決めたい', { free: 2, humor: 1 }],
    ['ざっくり決めて、あとは流れで', { free: 1, curious: 1 }],
    ['ちゃんと決めておきたい', { free: -1 }],
    ['全部決めてほしい', { free: -2 }] ] },
  { q: '彼にからかわれた。', a: [
    ['倍にして返す', { humor: 3, spark: 1 }],
    ['笑って流す', { humor: 2 }],
    ['ちょっと拗ねる', { humor: -1, direct: 1 }],
    ['からかわれるのは苦手', { humor: -2 }] ] },
  { q: '「好き」って言葉、どれくらい欲しい？', a: [
    ['言葉より行動で分かればいい', { direct: 1, free: 2 }],
    ['たまに言ってくれたら十分', { free: 1, direct: 1 }],
    ['ちゃんと言ってほしい', { free: -1, direct: 2 }],
    ['毎日言ってほしい', { free: -2 }] ] },
  { q: '彼の新しい挑戦（転職・旅・謎の趣味）を聞いたら？', a: [
    ['いいじゃん、どうやるの？と一緒にワクワクする', { curious: 2, spark: 1 }],
    ['応援する。でも計画は聞く', { curious: 1, direct: 1 }],
    ['大丈夫？とまず心配する', { curious: -1 }],
    ['また始まった…と思う', { curious: -2 }] ] },
  { q: '気持ちがモヤっとした時、どうする？', a: [
    ['その場ではっきり言う', { direct: 3, spark: 1 }],
    ['落ち着いてから話す', { direct: 2 }],
    ['察してほしい', { direct: -2 }],
    ['黙って距離を置く', { direct: -1, free: 1 }] ] },
];

const TYPES = [
  { min: 85, name: '刺激し合う 論破カップル型', tag: '最高の相性',
    voice: '正直、一緒にいて一番楽しいタイプ。言い返してくる人、好きなんです。',
    tips: ['議論は遠慮なく。言い負かされても楽しめるあなたは貴重です', '彼の思いつきに「それ面白い」と乗ると、一気に距離が縮まります', 'たまに真面目な本音を見せると、本気になります'],
    warn: '刺激が強いぶん、お互い言い過ぎることも。ケンカの後は、どちらかが先に笑ってください。' },
  { min: 70, name: '好奇心でつながる 冒険仲間型', tag: 'かなり良い相性',
    voice: '新しいことを一緒に面白がってくれる人とは、ずっと話していられます。',
    tips: ['行ったことのない場所や、やったことのない遊びに誘ってみて', '質問されると彼は喜びます。「なんでそう思うの？」が最強の一言', '予定は決めすぎず、余白を残すのがコツ'],
    warn: '楽しいだけで終わらないように、自分の気持ちも言葉にして伝えると安定します。' },
  { min: 55, name: '自由を許す 安心基地型', tag: '育てる相性',
    voice: '放っておいてくれる優しさに、あとから気づくタイプです。',
    tips: ['連絡が少なくても、気持ちが冷めたとは限りません', '会った時にちゃんと話を聞くと、彼はあなたの所に戻ってきます', '「あなたの話、面白い」は彼にとって最高の褒め言葉'],
    warn: '我慢しすぎは禁物。寂しい時は、責めずに短く伝えると彼も動きやすくなります。' },
  { min: 0, name: 'すれ違い注意の 慎重ペア型', tag: '工夫がいる相性',
    voice: '悪気はないんです。ただ、考えてることを言葉にするのが遅いだけで…。',
    tips: ['不安になったら、察してもらうより一言で聞く方が早いです', '彼の冗談は、からかいより“好意の確認”のことが多いです', '小さな約束を一緒に決めておくと、安心が増えます'],
    warn: '価値観の違いは大きめ。でも違いを面白がれたら、一番深い関係になることもあります。' },
];


window.ENTP_DEEP = { Q, TYPES };
})();

;
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
    $('rHim').textContent = R.him; $('rHim').className = 'emb g-' + TYPES[R.him].group;
    $('rYou').textContent = R.you; $('rYou').className = 'emb g-' + TYPES[R.you].group;
    renderMeters(R.meters);
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
    $('guide').hidden = !isEntp || !S.guideUrl;   // noteのURLを入れるまで非表示
    renderPr(R);
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

  // ───── 見た目の部品 ─────
  const icon = window.MBTI.icon;
  function renderMeters(ms) {
    const list = $('meterList'); list.replaceChildren();
    for (const m of ms) {
      const d = document.createElement('div'); d.className = 'mt';
      d.innerHTML = `<div class="row"><span></span><span>${m.v}%</span></div><div class="bar" aria-hidden="true"><i style="width:0%"></i></div>`;
      d.querySelector('span').textContent = m.label; list.appendChild(d);
      requestAnimationFrame(() => requestAnimationFrame(() => { d.querySelector('i').style.width = m.v + '%'; }));
    }
  }
  function decorate() {
    $('mtTitle').innerHTML = icon('chart') + '<span>ふたりの相性の中身</span>';
    $('hTips').innerHTML = icon('bulb') + '<span>うまくいく接し方</span>';
    $('hWarn').innerHTML = icon('alert') + '<span>気をつけたいこと</span>';
    $('steps').innerHTML = [['check', 'タイプを選ぶ', '彼とあなたの2つ'], ['heart', '相性が出る', '％と関係のタイプ'], ['bulb', '接し方がわかる', 'コツと注意点']]
      .map(([i, t, d], n) => `<li><span class="n">STEP ${n + 1}</span>${icon(i, 26)}<b>${t}</b><small>${d}</small></li>`).join('');
  }
  decorate();

  // ───── シェア画像 ─────
  function ensureCardLib() {
    if (window.MBTICard) return Promise.resolve();
    return new Promise((res, rej) => { const el = document.createElement('script'); el.src = 'card.js'; el.onload = res; el.onerror = rej; document.head.appendChild(el); });
  }
  async function makeCard() {
    try { await Promise.all([ensureCardLib(), document.fonts.load('400 60px "Dela Gothic One"')]); } catch (e) {}
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
  function tierOf(pct) { return pct >= 75 ? 'high' : pct >= 60 ? 'mid' : 'low'; }
  function prCard(it, R, top, tier) {
    const d = document.createElement('div'); d.className = 'exit pr' + (top ? ' top' : '');
    const k = document.createElement('div'); k.className = 'k'; k.textContent = 'PR（広告）';
    const ico = document.createElement('div'); ico.className = 'ico'; ico.innerHTML = icon(it.icon || 'star', top ? 22 : 26);
    const a = document.createElement('a'); a.className = 'btn'; a.href = it.url; a.target = '_blank'; a.rel = 'sponsored nofollow noopener'; a.textContent = it.btn;
    a.addEventListener('click', () => track('click_pr', { key: it.key, slot: top ? 'top' : 'bottom', tier, him: R.him, you: R.you }));
    const n = document.createElement('div'); n.className = 'slot'; n.textContent = `提供：${it.name}`;
    if (top) {
      const m = document.createElement('p'); m.className = 'msg'; m.textContent = (it.msg && it.msg[tier]) || it.title;
      const row = document.createElement('div'); row.className = 'row'; row.append(ico, a);
      d.append(k, m, row, n);
    } else {
      const head = document.createElement('div'); head.className = 'head';
      const h = document.createElement('h3'); h.textContent = it.title; head.append(ico, h);
      const p = document.createElement('p'); p.textContent = it.desc;
      const ul = document.createElement('ul');
      for (const pt of (it.points || [])) { const li = document.createElement('li'); li.innerHTML = icon('check', 18); const sp = document.createElement('span'); sp.textContent = pt; li.appendChild(sp); ul.appendChild(li); }
      d.append(k, head, p, ul, a, n);
    }
    return d;
  }
  // 結果（相性の高さ）に合う案件を優先して出す。1つ目は結果の直後、残りは下に並べる
  function renderPr(R) {
    const tier = tierOf(R.pct);
    const items = (S.prList || []).filter(x => x.url && ((x.w && x.w[tier]) ?? 1) > 0)
      .sort((a, b) => ((b.w && b.w[tier]) ?? 1) - ((a.w && a.w[tier]) ?? 1));
    $('prTop').replaceChildren(); $('prList').replaceChildren();
    if (!items.length) return;
    $('prTop').appendChild(prCard(items[0], R, true, tier));
    for (const it of items.slice(1)) $('prList').appendChild(prCard(it, R, false, tier));
  }
  const gd = $('guideLink');
  if (S.guideUrl) { gd.href = S.guideUrl; gd.target = '_blank'; gd.rel = 'noopener'; gd.textContent = 'ガイドを読む（note）'; } else gd.addEventListener('click', e => e.preventDefault());
  gd.addEventListener('click', () => track('click_guide', {}));
})();
