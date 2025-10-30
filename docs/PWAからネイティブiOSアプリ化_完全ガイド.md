# PWAからネイティブiOSアプリ化 完全ガイド

## 📋 目次
1. [プロジェクト概要](#プロジェクト概要)
2. [前提条件](#前提条件)
3. [Step 1: Replitでの準備](#step-1-replitでの準備)
4. [Step 2: Capacitorのインストール](#step-2-capacitorのインストール)
5. [Step 3: iOSプロジェクトの生成](#step-3-iosプロジェクトの生成)
6. [Step 4: Macでの作業準備](#step-4-macでの作業準備)
7. [Step 5: CocoaPodsのセットアップ](#step-5-cocoapodsのセットアップ)
8. [Step 6: 必要なファイルの作成・修正](#step-6-必要なファイルの作成修正)
9. [Step 7: Xcodeでのビルド](#step-7-xcodeでのビルド)
10. [Step 8: iPhoneへのインストール](#step-8-iphoneへのインストール)
11. [トラブルシューティング](#トラブルシューティング)
12. [まとめ](#まとめ)

---

## プロジェクト概要

### 🎯 目標
ReplitでホストされているPWA（Progressive Web App）の医療問診AIアプリを、**ネイティブiOSアプリ**に変換し、自分のiPhoneにインストールする。

### 📱 アプリの特徴
- **アプリ名**: 医療問診AI
- **機能**: OpenAI GPT-4oを使用した1問1答形式の医療問診
- **技術**: React + TypeScript, Express.js, OpenAI API
- **ホスティング**: Replit (`https://gpt-i-phone-fujikawa.replit.app`)

### 🔧 使用技術
- **Capacitor**: Webアプリをネイティブアプリに変換するフレームワーク
- **Xcode**: Appleの公式開発ツール
- **CocoaPods**: iOSの依存関係管理ツール

### ⚠️ 重要な制約
- **無料Apple ID使用**: アプリは7日間のみ有効
- **App Store非公開**: 学習目的、個人使用のみ
- **ハイブリッドアプリ**: UIはネイティブ、バックエンドはReplitサーバー
- **インターネット必須**: OpenAI APIを使用するため

---

## 前提条件

### 💻 必要な環境

#### Windows/Replit側
- ✅ Replitアカウント
- ✅ PWAアプリが完成し、デプロイ済み
- ✅ ブラウザ（Chrome、Edgeなど）

#### Mac側
- ✅ macOS（Intel Mac または Apple Silicon Mac）
- ✅ Xcode（最新版推奨）
  - App Storeから無料ダウンロード可能
- ✅ Homebrew（パッケージマネージャー）
- ✅ CocoaPods（後でインストール）

#### iPhone側
- ✅ iOS 13.0以降
- ✅ USB-Lightningケーブル
- ✅ Apple ID（無料でOK）

### 📚 必要な知識
- ✅ 基本的なコマンドライン操作
- ✅ ファイルのダウンロード・解凍
- ⚠️ プログラミング経験は不要

---

## Step 1: Replitでの準備

### 1.1 プロジェクトにアクセス

1. **Replitにログイン**
   ```
   https://replit.com
   ```

2. **プロジェクトを開く**
   - プロジェクト名: `gpt-i-phone-fujikawa`
   - URLを確認: `https://gpt-i-phone-fujikawa.replit.app`

3. **アプリが動作していることを確認**
   - デプロイURLにアクセス
   - 免責事項モーダルが表示される
   - 問診が正常に動作する

---

## Step 2: Capacitorのインストール

### 2.1 Capacitorパッケージをインストール

Replitのシェル（またはコンソール）で以下を実行：

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios
```

**所要時間**: 1-2分

**確認方法**:
- `package.json` を開いて、`dependencies` に以下が追加されているか確認
  ```json
  "@capacitor/core": "^6.x.x",
  "@capacitor/cli": "^6.x.x",
  "@capacitor/ios": "^6.x.x"
  ```

---

### 2.2 Capacitor設定ファイルを作成

プロジェクトのルートディレクトリに `capacitor.config.ts` を作成：

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.replit.medical.ai',
  appName: '医療問診AI',
  webDir: 'dist/public',
  server: {
    url: 'https://gpt-i-phone-fujikawa.replit.app',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  }
};

export default config;
```

**重要なポイント**:
- `appId`: アプリの一意な識別子（逆ドメイン形式）
- `appName`: iPhoneに表示されるアプリ名
- `webDir`: ビルドされたファイルの場所
- `server.url`: ReplitのデプロイURL（**あなたのURLに置き換え**）

---

## Step 3: iOSプロジェクトの生成

### 3.1 iOSプロジェクトを生成

Replitのシェルで以下を実行：

```bash
npx cap add ios
```

**所要時間**: 2-3分

**実行結果**:
```
✔ Adding native Xcode project in ios
✔ add in 2.34s
✔ Copying web assets from dist/public to ios/App/App/public in 150ms
✔ Creating capacitor.config.json in ios/App/App in 3ms
✔ copy ios in 156ms
✔ Updating iOS plugins in 5ms
✔ Updating iOS native dependencies with pod install in 30s
✔ update ios in 30.05s
```

**確認方法**:
- プロジェクトに `ios` フォルダが作成される
- `ios/App/App.xcworkspace` が存在する

---

## Step 4: Macでの作業準備

### 4.1 iosフォルダをダウンロード

#### 方法1: Replit Web UIから（推奨）

1. **MacのブラウザでReplitを開く**
   ```
   https://replit.com
   ```

2. **同じプロジェクトを開く**
   - `gpt-i-phone-fujikawa`

3. **iosフォルダをダウンロード**
   - 左側のファイルパネルで「**ios**」フォルダを右クリック
   - 「**Download as ZIP**」を選択
   - ダウンロード完了を待つ

4. **ZIPファイルを解凍**
   - ダウンロードフォルダの `ios.zip` をダブルクリック
   - `ios` フォルダが作成される

---

### 4.2 Homebrewのインストール（未インストールの場合）

ターミナルを開いて、以下を実行：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**確認方法**:
```bash
brew --version
```

---

### 4.3 CocoaPodsのインストール

ターミナルで以下を実行：

```bash
brew install cocoapods
```

**確認方法**:
```bash
pod --version
```

---

## Step 5: CocoaPodsのセットアップ

### 5.1 iosフォルダに移動

ターミナルで：

```bash
cd ~/Downloads/ios/App
```

**確認**:
```bash
ls
```

以下が表示されればOK:
```
App		Podfile		Pods
```

---

### 5.2 Podfileを修正

ダウンロードしたPodfileには`node_modules`への参照が含まれていますが、
iosフォルダだけをダウンロードしたため存在しません。

**Podfileを書き換え**:

```bash
cat > Podfile << 'EOF'
platform :ios, '13.0'
use_frameworks!

target 'App' do
  # No pods needed for now - using direct WebView
end
EOF
```

---

### 5.3 CocoaPods依存関係をインストール

```bash
pod install
```

**所要時間**: 1-3分

**成功メッセージ**:
```
Pod installation complete! There are 0 dependencies from the Podfile and 0 total pods installed.
```

⚠️ 警告メッセージ `[!] The Podfile does not contain any dependencies.` は無視してOK

---

## Step 6: 必要なファイルの作成・修正

iosフォルダをダウンロードした後、いくつかのファイルを修正・作成する必要があります。

### 6.1 ViewController.swiftを作成（重要）

このファイルはWebView（Webページを表示する画面）を制御します。

**Replitで作成する場合**:

Replitで `ios/App/App/ViewController.swift` を作成し、以下を貼り付け：

```swift
import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate {
    
    var webView: WKWebView!
    
    override func loadView() {
        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.allowsInlineMediaPlayback = true
        webConfiguration.mediaTypesRequiringUserActionForPlayback = []
        
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = self
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        
        view = webView
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Load the Replit URL
        if let url = URL(string: "https://gpt-i-phone-fujikawa.replit.app") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
    
    // WKNavigationDelegate methods
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("Started loading: \(webView.url?.absoluteString ?? "")")
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("Finished loading: \(webView.url?.absoluteString ?? "")")
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("Failed to load: \(error.localizedDescription)")
    }
}
```

**Xcodeで作成する場合**（Step 7で実施）:

後述のXcode手順で直接作成できます。

---

### 6.2 AppDelegate.swiftを修正

**Replitで修正する場合**:

`ios/App/App/AppDelegate.swift` を以下に置き換え：

```swift
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Create window
        window = UIWindow(frame: UIScreen.main.bounds)
        
        // Set root view controller
        let viewController = ViewController()
        window?.rootViewController = viewController
        window?.makeKeyAndVisible()
        
        return true
    }
    
    func applicationWillResignActive(_ application: UIApplication) {
    }
    
    func applicationDidEnterBackground(_ application: UIApplication) {
    }
    
    func applicationWillEnterForeground(_ application: UIApplication) {
    }
    
    func applicationDidBecomeActive(_ application: UIApplication) {
    }
    
    func applicationWillTerminate(_ application: UIApplication) {
    }
}
```

---

### 6.3 Info.plistを更新

`ios/App/App/Info.plist` に、HTTP通信の許可を追加：

`</dict>` の直前に以下を挿入：

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

**完全なInfo.plist例**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleDisplayName</key>
    <string>医療問診AI</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>$(MARKETING_VERSION)</string>
    <key>CFBundleVersion</key>
    <string>$(CURRENT_PROJECT_VERSION)</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIMainStoryboardFile</key>
    <string>Main</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    <key>UISupportedInterfaceOrientations~ipad</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    <key>UIViewControllerBasedStatusBarAppearance</key>
    <true/>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
</dict>
</plist>
```

---

### 6.4 ファイル修正後の再ダウンロード

**重要**: ファイルを修正したら、iosフォルダを再度ダウンロードしてください。

1. Macの古い`~/Downloads/ios`フォルダを削除
2. Replitで新しい`ios`フォルダをダウンロード
3. 解凍

---

## Step 7: Xcodeでのビルド

### 7.1 Xcodeでプロジェクトを開く

ターミナルで：

```bash
cd ~/Downloads/ios/App
open App.xcworkspace
```

**重要**: 必ず `.xcworkspace` を開く（`.xcodeproj` ではない）

---

### 7.2 ViewController.swiftを作成（Replitで作成していない場合）

#### Xcodeで新規ファイルを作成:

1. **メニューバー** → 「**File**」 → 「**New**」 → 「**File...**」
   - ショートカット: `Command + N`

2. 「**iOS**」 → 「**Swift File**」を選択

3. 「**Next**」をクリック

4. **Save As**: `ViewController` と入力

5. **Targets**: 「**App**」にチェックが入っていることを確認

6. 「**Create**」をクリック

#### コードを貼り付け:

新しく作成された `ViewController.swift` に、前述のコードを貼り付けてください。

---

### 7.3 署名設定（Signing & Capabilities）

1. **左側のファイルリスト**で、一番上の**青い「App」アイコン**をクリック

2. **中央のメインエリア**で「**Signing & Capabilities**」タブをクリック

3. **「Automatically manage signing」にチェック**を入れる

4. **「Team」のドロップダウン**をクリック
   - 自分のApple IDが表示されている場合 → 選択
   - 表示されていない場合:
     1. 「**Add an Account...**」をクリック
     2. Apple IDとパスワードでログイン
     3. ログイン後、再度Teamを選択

5. **エラーがないことを確認**
   - ✅ 緑のチェックマークが表示されればOK
   - ⚠️ 黄色い警告が出た場合は、後述のトラブルシューティング参照

---

### 7.4 iPhoneを接続

1. **USBケーブル**でiPhoneをMacに接続

2. **iPhone側**で「このコンピュータを信頼しますか？」と表示されたら:
   - 「**信頼**」をタップ
   - パスコードを入力（求められた場合）

3. **Xcode画面の上部中央**を確認
   - デバイス選択エリアに**あなたのiPhoneの名前**が表示される
   - 表示されていない場合は、クリックして選択

---

### 7.5 開発者モードを有効化（iOS 16以降）

iPhoneで：

1. 「**設定**」→「**プライバシーとセキュリティ**」
2. 一番下にスクロール
3. 「**開発者モード**」をオン
4. iPhoneを再起動

---

### 7.6 クリーンビルド

Xcodeで：

```
Shift + Command + K
```

または、メニューバー →「**Product**」→「**Clean Build Folder**」

---

### 7.7 ビルド実行

1. Xcode左上の**▶️（再生ボタン）**をクリック

2. ビルドが開始される
   - 画面上部に進行状況が表示される
   - 初回は**5-10分**かかる場合がある

3. ビルド完了を待つ
   - 「**Build Succeeded**」と表示される

---

## Step 8: iPhoneへのインストール

### 8.1 信頼設定（初回のみ）

ビルド成功後、iPhoneでアプリを起動すると、以下のエラーが出る場合があります：

```
信頼されていないエンタープライズデベロッパ
```

**解決方法**:

1. iPhoneで「**設定**」アプリを開く

2. 「**一般**」をタップ

3. 「**VPNとデバイス管理**」をタップ
   - iOS 15以前: 「**プロファイルとデバイス管理**」

4. 「**デベロッパApp**」セクションで、**あなたのApple ID（メールアドレス）**をタップ

5. 「**"（あなたのメールアドレス）"を信頼**」をタップ

6. 確認ダイアログで「**信頼**」をタップ

---

### 8.2 アプリを起動

1. iPhoneのホーム画面に戻る

2. 「**医療問診AI**」アイコンをタップ

3. アプリが起動！🎉

**表示されるもの**:
- ✅ 免責事項モーダル
- ✅ 問診開始画面
- ✅ Replitと同じ機能

---

## トラブルシューティング

### 問題1: `pod install` でエラー

**エラーメッセージ**:
```
[!] No `Podfile' found in the project directory.
```

**解決方法**:
```bash
cd ~/Downloads/ios/App  # Appフォルダに移動
pod install
```

---

### 問題2: `Cannot find 'ViewController' in scope`

**原因**: ViewController.swiftファイルが存在しないか、Xcodeプロジェクトに追加されていない

**解決方法**:
1. Xcodeで新しいSwift Fileを作成（`Command + N`）
2. ファイル名: `ViewController`
3. 前述のコードを貼り付け
4. 保存（`Command + S`）
5. クリーンビルド（`Shift + Command + K`）
6. 再ビルド

---

### 問題3: `Cannot find 'ApplicationDelegateProxy' in scope`

**原因**: Capacitor依存のコードが残っている

**解決方法**:
1. `AppDelegate.swift` を開く
2. `import Capacitor` の行を削除
3. `ApplicationDelegateProxy` への参照を削除
4. 前述の簡略版AppDelegate.swiftに置き換え

---

### 問題4: 真っ黒な画面が表示される

**原因**: WebViewが設定されていない

**解決方法**:
1. `ViewController.swift` が正しく作成されているか確認
2. URLが正しいか確認（`https://gpt-i-phone-fujikawa.replit.app`）
3. Info.plistに `NSAppTransportSecurity` が追加されているか確認
4. クリーンビルド → 再ビルド

---

### 問題5: Code signing error

**エラーメッセージ**:
```
Code signing is required for product type 'Application' in SDK 'iOS 17.0'
```

**解決方法**:
1. Signing & Capabilitiesタブを開く
2. Teamを「None」にしてから、再度Apple IDを選択
3. Bundle Identifierを変更（例: `com.yourname.medical.ai`）
4. クリーンビルド → 再ビルド

---

### 問題6: 7日後にアプリが起動しない

**原因**: 無料Apple IDの制限（7日間有効）

**解決方法**:
1. Xcodeでプロジェクトを開く
2. iPhoneを接続
3. クリーンビルド（`Shift + Command + K`）
4. 再ビルド（▶️ボタンをクリック）
5. iPhone側で再度信頼設定

---

## まとめ

### 🎉 達成したこと

✅ **PWAアプリをネイティブiOSアプリに変換**  
✅ **Capacitorを使用したハイブリッドアプリ開発**  
✅ **Xcodeでのビルドとデバッグ**  
✅ **実機（iPhone）へのインストール**  
✅ **ネイティブiOS開発の基礎を学習**  

---

### 📱 アプリの特徴

- **ハイブリッドアプリ**: UIはネイティブ、バックエンドはReplit
- **WebView使用**: ReplitのURLを読み込んで表示
- **インターネット必須**: OpenAI APIを呼び出すため
- **7日間有効**: 無料Apple IDの制限

---

### 🔄 7日後の再インストール手順

1. Macに移動
2. ターミナルを開く
3. 以下を実行:
   ```bash
   cd ~/Downloads/ios/App
   open App.xcworkspace
   ```
4. iPhoneを接続
5. Xcodeで`Shift + Command + K`（クリーンビルド）
6. ▶️ボタンをクリック（ビルド）
7. iPhone側で信頼設定（初回のみ）
8. アプリ起動

---

### 📚 参考資料

- **Capacitor公式ドキュメント**: https://capacitorjs.com/docs
- **Apple Developer**: https://developer.apple.com
- **Xcode チュートリアル**: https://developer.apple.com/tutorials/app-dev-training

---

### 🛠️ さらに改善するには

1. **カスタムアイコン**: `ios/App/App/Assets.xcassets/AppIcon.appiconset/` にアイコン画像を追加
2. **スプラッシュ画面**: `LaunchScreen.storyboard` をカスタマイズ
3. **オフライン対応**: Service Workerの改善
4. **プッシュ通知**: Capacitor Pluginsを追加（有料Apple Developer Program必須）
5. **App Store公開**: 年間99ドルのApple Developer Programに加入

---

## 📝 最後に

このガイドを使えば、いつでもPWAアプリをネイティブiOSアプリに変換できます。

何か問題が発生した場合は、トラブルシューティングセクションを参照するか、
Capacitorの公式ドキュメントを確認してください。

**おめでとうございます！ネイティブiOSアプリ開発の第一歩です！** 🎉

---

**作成日**: 2025年10月30日  
**プロジェクト**: 医療問診AI  
**バージョン**: 1.0  
**著者**: Replit Agent & Tadahiro Fujikawa
