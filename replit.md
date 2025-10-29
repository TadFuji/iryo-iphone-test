# 医療問診AI - 高精度症状診断サポート

## プロジェクト概要
OpenAI GPT-4oを使用した高精度医療問診AIのiPhone対応PWA（Progressive Web App）。ユーザーの症状を詳細に聞き取り、90%以上の確信度で原因を特定することを目指します。ホーム画面に追加してネイティブアプリのように使用可能。

## 主要機能
- **1問1答形式の問診**: 最大50問まで、1つずつ質問を行う
- **200文字制限**: AI応答は200文字以内（最終レポート除く）
- **緊急度判定**: 生命を脅かす症状を検出し、即座に救急受診を促す
- **確信度評価**: 0-100%で診断の確信度を表示
- **最終診断レポート**: 詳細な分析結果と推奨される対応
- **ローカルストレージ保存**: 会話履歴をブラウザに保存し、再開可能
- **PWA対応**: iPhoneホーム画面にインストール可能、オフライン対応
- **iPhone最適化**: レスポンシブデザイン、セーフエリア対応

## 技術スタック

### Frontend
- React + TypeScript
- Tailwind CSS + Shadcn UI
- Wouter (ルーティング)
- TanStack Query (データフェッチング)
- localStorage (会話履歴保存)

### Backend
- Express.js
- OpenAI GPT-4o API
- メモリストレージ (MemStorage)

### PWA
- Web App Manifest (manifest.json)
- Service Worker (オフライン対応、キャッシュ戦略)
- Apple PWA meta tags
- PWAアイコン（192x192, 512x512, 180x180）

## アーキテクチャ

### データフロー
1. ユーザーが免責事項に同意
2. 初回メッセージでGPT-4oに問診開始
3. 各ユーザー回答ごとにGPT-4oが分析:
   - 緊急度判定
   - 確信度計算
   - 次の質問生成または最終レポート作成
4. 全ての会話履歴をローカルストレージに保存

### PWAアーキテクチャ
- **manifest.json**: アプリメタデータ、アイコン、テーマカラー設定
- **Service Worker (sw.js)**:
  - Static assets: Cache First戦略（オフライン対応）
  - API calls: Network First戦略（オフライン時はエラーメッセージ）
  - キャッシュバージョニングと自動クリーンアップ
- **登録条件**: 本番環境またはHTTPS環境でのみService Workerを登録
- **インストール**: iPhoneでSafariの「共有」→「ホーム画面に追加」

### API エンドポイント
- `POST /api/chat`: メッセージ送信と応答取得

### GPT-4oプロンプト設計
添付されたプロンプトファイル（`attached_assets/Pasted--AI-AI--1761731676346_1761731676346.txt`）に従い:
- システムプロンプトで医療問診AIの役割を定義
- 1問1答、200文字制限を厳守
- 緊急度判定と確信度評価を実施
- 10問以上かつ確信度90%以上、または50問到達で完了
- 検証とリトライ機構で回答品質を保証

## コンポーネント構成

### Pages
- `Home.tsx`: メインチャット画面、状態管理、API連携

### Components
- `DisclaimerModal.tsx`: 免責事項モーダル
- `ChatMessage.tsx`: メッセージバブル（ユーザー/AI）
- `ChatInput.tsx`: メッセージ入力フィールド
- `ProgressBar.tsx`: 質問数と確信度表示
- `EmergencyBanner.tsx`: 緊急警告バナー
- `TypingIndicator.tsx`: AI応答中のローディング表示
- `FinalReport.tsx`: 最終診断レポート表示

## 環境変数
- `OPENAI_API_KEY`: OpenAI APIキー（Replit Secretsで管理）
- `SESSION_SECRET`: セッション暗号化キー（Replit Secretsで管理）

## ユーザーフロー

1. **初回アクセス**
   - 免責事項モーダル表示
   - 同意後、問診開始

2. **問診中**
   - AIが1問ずつ質問
   - ユーザーが回答
   - 質問数と確信度をリアルタイム表示

3. **緊急時**
   - 緊急性検出時、赤い警告バナー表示
   - 119番通報ボタン提供

4. **完了時**
   - 最終診断レポート表示
   - レポートダウンロード可能
   - 新規問診開始ボタン

## デザインガイドライン
`design_guidelines.md`参照
- Apple HIG準拠
- SF Pro フォント使用
- モバイルファースト設計
- 44px最小タッチターゲット
- セーフエリア対応

## 最近の変更
- 2025-10-29: 初期実装完了 + PWA対応
  - フロントエンド全コンポーネント作成
  - バックエンドAPI実装
  - OpenAI GPT-4o統合（gpt-5→gpt-4o修正）
  - ローカルストレージ機能
  - PWA対応実装:
    * manifest.json作成
    * Service Worker実装（キャッシュ戦略、オフライン対応）
    * PWAアイコン生成（192x192, 512x512, 180x180）
    * Apple PWA meta tags設定
    * iPhoneホーム画面インストール対応完了
  - E2Eテスト完全合格（問診フロー、PWA機能）
