# 医療問診AI - 高精度症状診断サポート

![PWA](https://img.shields.io/badge/PWA-Progressive%20Web%20App-blue)
![iOS](https://img.shields.io/badge/iOS-Native%20App-black)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991)
![TypeScript](https://img.shields.io/badge/TypeScript-React-3178c6)

OpenAI GPT-4oを使用した高精度医療問診AIのiPhone対応PWA（Progressive Web App）。
ユーザーの症状を詳細に聞き取り、90%以上の確信度で原因を特定することを目指します。
ホーム画面に追加してネイティブアプリのように使用可能。

**🚀 デプロイ済みアプリ**: https://gpt-i-phone-fujikawa.replit.app

---

## ✨ 主要機能

- **1問1答形式の問診**: 最大50問まで、1つずつ質問を行う
- **200文字制限**: AI応答は200文字以内（最終レポート除く）
- **緊急度判定**: 生命を脅かす症状を検出し、即座に救急受診を促す
- **確信度評価**: 0-100%で診断の確信度を表示
- **最終診断レポート**: 詳細な分析結果と推奨される対応
- **ローカルストレージ保存**: 会話履歴をブラウザに保存し、再開可能
- **PWA対応**: iPhoneホーム画面にインストール可能、オフライン対応
- **iPhone最適化**: レスポンシブデザイン、セーフエリア対応
- **ネイティブiOSアプリ化**: Capacitorを使用したハイブリッドアプリ対応

---

## 🛠 技術スタック

### Frontend
- **React** + **TypeScript**
- **Tailwind CSS** + **Shadcn UI**
- **Wouter** (ルーティング)
- **TanStack Query** (データフェッチング)
- **localStorage** (会話履歴保存)

### Backend
- **Express.js**
- **OpenAI GPT-4o API**
- **メモリストレージ** (MemStorage)

### PWA
- **Web App Manifest** (manifest.json)
- **Service Worker** (オフライン対応、キャッシュ戦略)
- **Apple PWA meta tags**
- **PWAアイコン**（192x192, 512x512, 180x180）

### ネイティブiOSアプリ
- **Capacitor** (@capacitor/core, @capacitor/cli, @capacitor/ios)
- **WKWebView** (WebViewコントローラー)
- **Xcode** (ビルド・署名)

---

## 📱 インストール方法

### PWAとしてインストール（iPhone）

1. https://gpt-i-phone-fujikawa.replit.app にアクセス
2. Safariの「共有」ボタンをタップ
3. 「ホーム画面に追加」を選択
4. 完了！ホーム画面からアプリを起動できます

### ネイティブiOSアプリとしてインストール

詳細な手順は **[PWAからネイティブiOSアプリ化 完全ガイド](./docs/PWAからネイティブiOSアプリ化_完全ガイド.md)** を参照してください。

**概要**:
1. Capacitorのセットアップ
2. iOSプロジェクトの生成
3. Xcodeでビルド
4. iPhoneにインストール

**注意**: 無料Apple IDの場合、7日間の有効期限があります。

---

## 🚀 開発環境のセットアップ

### 必要な環境
- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存パッケージをインストール
npm install

# 環境変数を設定
# .env ファイルを作成し、以下を追加:
# OPENAI_API_KEY=your_openai_api_key
# SESSION_SECRET=your_session_secret

# 開発サーバーを起動
npm run dev
```

### 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI APIキー | ✅ |
| `SESSION_SECRET` | セッション暗号化キー | ✅ |

---

## 📂 プロジェクト構成

```
.
├── client/                 # フロントエンド
│   ├── src/
│   │   ├── components/    # UIコンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   └── lib/           # ユーティリティ
├── server/                 # バックエンド
│   ├── routes.ts          # APIルート
│   ├── medicalConsultation.ts  # GPT-4o問診ロジック
│   └── storage.ts         # ストレージインターフェース
├── ios/                    # ネイティブiOSプロジェクト
│   └── App/
│       ├── App/
│       │   ├── ViewController.swift
│       │   ├── AppDelegate.swift
│       │   └── Info.plist
│       └── Podfile
├── docs/                   # ドキュメント
│   └── PWAからネイティブiOSアプリ化_完全ガイド.md
├── public/                 # 静的ファイル
│   ├── manifest.json      # PWA設定
│   └── sw.js              # Service Worker
└── shared/                 # 共有型定義
    └── schema.ts
```

---

## 🎯 使い方

### 1. 問診の開始

1. アプリを起動
2. 免責事項に同意
3. 最初の症状を入力

### 2. 問診の進行

- AIが1問ずつ質問
- 質問数と確信度がリアルタイムで表示
- 緊急性が検出された場合、警告バナーが表示

### 3. 診断完了

- 最終診断レポートを確認
- レポートをダウンロード可能
- 新規問診を開始

---

## 🔒 セキュリティとプライバシー

- **データ保存**: 会話履歴はブラウザのローカルストレージにのみ保存
- **サーバー保存なし**: サーバー側には会話データを保存しません
- **HTTPS通信**: すべての通信は暗号化されています
- **医療免責事項**: アプリ起動時に免責事項を表示

⚠️ **重要**: このアプリは医療診断の補助ツールであり、医師の診察を代替するものではありません。

---

## 📚 ドキュメント

- **[PWAからネイティブiOSアプリ化 完全ガイド](./docs/PWAからネイティブiOSアプリ化_完全ガイド.md)**: Capacitorを使用したネイティブiOSアプリ化の完全な手順

---

## 🧪 テスト

E2Eテストは完了済み：
- ✅ 問診フロー
- ✅ PWA機能
- ✅ ローカルストレージ
- ✅ 緊急度判定

---

## 🌐 デプロイ

**本番環境**: https://gpt-i-phone-fujikawa.replit.app

Replitで自動デプロイされています。

---

## 📝 ライセンス

このプロジェクトは個人学習目的で作成されています。

---

## 🙏 謝辞

- **OpenAI** - GPT-4o API
- **Replit** - ホスティング・デプロイメント
- **Shadcn UI** - UIコンポーネント
- **Capacitor** - ネイティブアプリ化

---

## 📧 お問い合わせ

問題や質問がある場合は、GitHubのIssuesをご利用ください。

---

**Made with ❤️ by Fujikawa**
