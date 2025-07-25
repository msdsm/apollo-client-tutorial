# Apollo Client入門チュートリアル

Apollo ClientとGraphQLの基本的な使い方を学ぶためのハンズオン形式のReactアプリケーションです。

## 概要

このプロジェクトでは、以下のApollo Clientの機能を実際に動かしながら学ぶことができます。

- 基本的なGraphQLクエリの実行
- 変数を使った動的クエリ
- キャッシュシステムの活用
- エラーハンドリングとリトライ機能


## 前提条件

- Node.js (v16以上)
- npm または yarn

## 動かし方

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm start
```

ブラウザで `http://localhost:3000` にアクセスしてアプリケーションを確認できます。

## プロジェクト構成

```
src/
├── components/
│   ├── CountryList.js      # 基本的なクエリ実行
│   ├── CountryDetail.js    # 変数を使ったクエリ
│   ├── CacheExample.js     # キャッシュの動作確認
│   └── ErrorExample.js     # エラーハンドリング
├── apollo-client.js        # Apollo Client設定
├── App.js                  # メインコンポーネント
└── index.js               # アプリケーションエントリーポイント
```

## 内容

### 1. CountryList コンポーネント
- `useQuery`フックの基本的な使用方法
- GraphQLクエリの定義方法
- loading、error、data状態の管理

### 2. CountryDetail コンポーネント  
- GraphQLクエリでの変数（Variables）の使用
- 動的なクエリ実行
- Reactの状態管理との連携

### 3. CacheExample コンポーネント
- Apollo Clientのキャッシュシステム
- 異なるフェッチポリシーの動作確認
- `refetch`機能とネットワーク状態の監視

### 4. ErrorExample コンポーネント
- GraphQLエラーの適切な処理
- `errorPolicy`オプションの活用
- リトライ機能の実装


## GraphQL API
このプロジェクトでは、[Countries GraphQL API](https://countries.trevorblades.com/graphql) を使用しています。
世界の国々の情報を取得できるパブリックなAPIです。

