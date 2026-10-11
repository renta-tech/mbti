// 公開時にここだけ書き換える
window.SITE = {
  url: 'https://renta-tech.github.io/mbti/',            // 公開URL。build.mjs が SITE_URL から自動で入れる
  gaId: '',           // Googleアナリティクス4の測定ID（G-XXXXXXX）。空なら計測しない
  guideUrl: '',       // 有料ガイド（note）のURL
  contact: 'TikTok @entp0341 のDM',
  // PR枠。url が空の案件は画面に出ない（承認されてリンクを入れたものだけ表示）
  prList: [
    { key: 'coconala', name: 'ココナラ占い＆お悩み相談',
      title: '彼の気持ちを、占いや相談で聞いてみたい人へ',
      desc: 'チャットやメールで、恋愛の悩みを占い師やカウンセラーに相談できます（電話相談は対象外）。',
      btn: 'ココナラで相談してみる', url: 'https://px.a8.net/svt/ejp?a8mat=4BED95+3CV1CQ+2PEO+1BVOGX' },
    { key: 'photo', name: 'マッチングフォト',
      title: 'マッチングアプリを使うなら、プロフィール写真から',
      desc: 'プロが撮影するマッチングアプリ用のプロフィール写真サービス。18歳以上向けです。',
      btn: 'マッチングフォトを見る', url: '' },
  ],
};
