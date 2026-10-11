// 公開時にここだけ書き換える
window.SITE = {
  url: 'https://renta-tech.github.io/mbti/',            // 公開URL。build.mjs が SITE_URL から自動で入れる
  gaId: '',           // Googleアナリティクス4の測定ID（G-XXXXXXX）。空なら計測しない
  guideUrl: '',       // 有料ガイド（note）のURL
  contact: 'TikTok @entp0341 のDM',
  // PR枠。url が空の案件は画面に出ない（承認されてリンクを入れたものだけ表示）
  prList: [
    { key: 'coconala', name: 'ココナラ占い＆お悩み相談', icon: 'chat',
      // w: 結果ごとの表示の優先度（0は出さない／大きいほど先頭）。msg: 結果ごとの誘導文
      w: { high: 3, mid: 3, low: 2 },
      msg: { high: 'ふたりの相性は良好。彼の気持ちをもっと確かめたいなら', mid: 'うまくいくかは接し方しだい。迷ったら、占いや相談で聞いてみる', low: '彼との距離の縮め方に悩むなら、占いや相談で整理してみる' },
      points: ['チャット・メールで相談できる', '口コミを見て占い師を選べる', '会員登録は無料（相談は有料）'],
      title: '彼の気持ちを、占いや相談で聞いてみたい人へ',
      desc: 'チャットやメールで、恋愛の悩みを占い師やカウンセラーに相談できます（電話相談は対象外）。',
      btn: 'ココナラで相談してみる', url: 'https://px.a8.net/svt/ejp?a8mat=4BED95+3CV1CQ+2PEO+1BVOGX' },
    { key: 'photo', name: 'マッチングフォト', icon: 'camera',
      w: { high: 0, mid: 0, low: 3 },
      msg: { low: 'この人だけが答えじゃない。新しい出会いを探すなら、まずプロフィール写真から' },
      points: ['マッチングアプリ用の撮影サービス', 'プロが撮影してくれる', '料金はプランによって異なります（有料）'],
      title: 'マッチングアプリを使うなら、プロフィール写真から',
      desc: 'プロが撮影するマッチングアプリ用のプロフィール写真サービス。18歳以上向けです。',
      btn: 'マッチングフォトを見る', url: 'https://px.a8.net/svt/ejp?a8mat=4BED95+3ENC62+4MM2+5YJRM' },
  ],
};
