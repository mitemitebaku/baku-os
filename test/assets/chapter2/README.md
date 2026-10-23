# 第2章の差し替え素材

現在の夢アイコンと眠っているばくは、SVGの仮素材です。
- dream_a.svg / dream_b.svg / dream_c.svg / dream_d.svg
- baku_sleep.svg

音声は未同梱です。次の名前でMP3を追加すると、そのまま再生されます。
- dream_a.mp3 / dream_b.mp3 / dream_c.mp3 / dream_d.mp3

すべて `test/assets/chapter2/` に配置してください。音声がない場合も証言を文字で読めます。

PNG画像を使う場合は `test/index.html` のchapter2.js読み込み前で以下を設定できます。これは公開用の素材パスだけを設定する項目です。

```html
<script>
window.BAKU_CHAPTER2_ASSETS = {
  a: { image: 'assets/chapter2/dream_a.png' },
  b: { image: 'assets/chapter2/dream_b.png' },
  c: { image: 'assets/chapter2/dream_c.png' },
  d: { image: 'assets/chapter2/dream_d.png' },
  patient: 'assets/chapter2/baku_sleep.png'
};
</script>
```

音声パスも各項目の `audio` で指定できます。画像が読み込めない場合は絵文字または文字の代替表示になります。
