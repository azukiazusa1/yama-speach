# 朝会スピーチ・トレイル

Three.jsで作られた、朝会スピーチの原稿を集める三人称3Dゲームです。

## 起動

```sh
npm install
npm run dev
```

表示されたローカルURLを最新版のChromeで開いてください。

## 操作

- `WASD` / 矢印キー: 移動
- `Shift`: ダッシュ
- マウス: カメラ操作
- `E`: 近くの原稿を取得
- 左右矢印: クリア後のスライド操作

3分以内に6つの原稿を集めると、`script.md`をもとにした全7枚の朝会スピーチが表示されます。原稿カードを読んでいる間、タイマーは停止します。

## GitHub Pages

`main` ブランチへpushすると、`.github/workflows/deploy-pages.yml` がビルドとGitHub Pagesへのデプロイを実行します。初回のみ、GitHubリポジトリの **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選択してください。
