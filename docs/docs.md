# Apollo Client入門 - ハンズオンで学ぶGraphQL クライアント

## はじめに

Apollo Clientは、GraphQLクエリを簡単に実行できるJavaScript用のクライアントライブラリです。この記事では、実際にコードを書きながらApollo Clientの基本的な使い方を学んでいきます。

ソースコードは以下にあります。
[https://github.com/msdsm/apollo-client-tutorial](https://github.com/msdsm/apollo-client-tutorial)

## 事前準備

### プロジェクトの初期化

まず、新しいReactプロジェクトを作成します。

```bash
npx create-react-app apollo-client-tutorial
cd apollo-client-tutorial
```

必要なパッケージをインストールします。

```bash
npm install @apollo/client graphql
```

## Step 1: Apollo Clientの基本設定

### 1.1 Apollo Clientインスタンスの作成

`src/apollo-client.js`ファイルを作成し、Apollo Clientを設定します。

```javascript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// GraphQLエンドポイントへのHTTPリンクを作成
const httpLink = createHttpLink({
  uri: 'https://countries.trevorblades.com/graphql', // パブリックなGraphQL API
});

// Apollo Clientインスタンスを作成
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
```

### 1.2 ApolloProviderでアプリをラップ

`src/index.js`を編集して、ApolloProviderを設定します。

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import client from './apollo-client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
```

## Step 2: 初めてのクエリ実行

### 2.1 useQueryフックを使った基本的なデータ取得

ここでは、GraphQLクエリを実行して世界の国々のリストを表示するコンポーネントを作成します。このコンポーネントの目的は以下の3つです。

- **GraphQLクエリの基本的な書き方を学ぶ**
- **useQueryフックの使用方法を理解する**
- **loading、error、dataの状態管理を実装する**

`src/components/CountryList.js`を作成します。

```javascript
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

// GraphQLクエリを定義
const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      emoji
    }
  }
`;

function CountryList() {
  const { loading, error, data } = useQuery(GET_COUNTRIES);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error.message}</p>;

  return (
    <div>
      <h2>世界の国々</h2>
      <ul>
        {data.countries.map((country) => (
          <li key={country.code}>
            {country.emoji} {country.name} ({country.code})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CountryList;
```

### 2.2 Appコンポーネントの更新

`src/App.js`を編集してCountryListコンポーネントを使用します。

```javascript
import React from 'react';
import CountryList from './components/CountryList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Apollo Client チュートリアル</h1>
        <CountryList />
      </header>
    </div>
  );
}

export default App;
```

### 実行してみよう

```bash
npm start
```

ブラウザで`http://localhost:3000`にアクセスして、世界の国々のリストが表示されることを確認しましょう。

## Step 3: 変数を使ったクエリ

### 3.1 パラメータ付きクエリの実装

このコンポーネントでは、より実践的なGraphQLクエリの使用方法を学びます。具体的な目的は以下の4つです。

- **GraphQLクエリで変数（Variables）を使用する方法を学ぶ**
- **ユーザーの入力に応じて動的にクエリを実行する**
- **特定の国の詳細情報を取得して表示する**
- **Reactの状態管理とApollo Clientの連携を理解する**

`src/components/CountryDetail.js`を作成します。

```javascript
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

// 変数を使用するGraphQLクエリの定義
// $code: ID! は、code変数がID型で必須であることを示す
const GET_COUNTRY = gql`
  query GetCountry($code: ID!) {
    country(code: $code) {
      name
      code
      emoji
      currency    # 通貨
      languages {
        name      # 言語名
      }
      continent {
        name      # 大陸名
      }
    }
  }
`;

function CountryDetail() {
  // 国コードを管理するローカル状態（初期値はJP=日本）
  const [countryCode, setCountryCode] = useState('JP');
  
  // variablesオプションを使用してクエリに変数を渡す
  const { loading, error, data } = useQuery(GET_COUNTRY, {
    variables: { code: countryCode }, // countryCodeの値をcode変数として渡す
  });

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error.message}</p>;

  const country = data.country;

  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
      <h3>国の詳細情報</h3>
      <div>
        <label>
          国コード: 
          <input 
            value={countryCode} 
            // 入力値が変更されたら状態を更新（大文字に変換）
            onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
            placeholder="例: JP, US, DE"
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      
      {/* 国のデータが存在する場合のみ表示 */}
      {country && (
        <div style={{ marginTop: '20px' }}>
          <h4>{country.emoji} {country.name}</h4>
          <p><strong>コード:</strong> {country.code}</p>
          <p><strong>通貨:</strong> {country.currency}</p>
          <p><strong>大陸:</strong> {country.continent.name}</p>
          <p><strong>言語:</strong> {country.languages.map(lang => lang.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default CountryDetail;
```

### 3.2 App.jsの更新

```javascript
import React from 'react';
import CountryList from './components/CountryList';
import CountryDetail from './components/CountryDetail';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Apollo Client チュートリアル</h1>
        <CountryDetail />
        <CountryList />
      </header>
    </div>
  );
}

export default App;
```

### 試してみよう

入力欄に異なる国コード（JP, US, DE, FR など）を入力して、動的にデータが更新されることを確認しましょう。

## Step 4: キャッシュとrefetchの活用

### 4.1 Apollo Clientのキャッシュシステムについて

Apollo Clientの最も強力な機能の一つがキャッシュシステムです。キャッシュは以下のような利点があります：

**キャッシュの利点**
- **パフォーマンス向上**: 一度取得したデータを再利用することで、不要なネットワークリクエストを削減
- **ユーザーエクスペリエンス**: データの即座な表示により、アプリケーションの応答性が向上
- **オフライン対応**: ネットワークが不安定な環境でも、キャッシュされたデータを表示可能

**主要なフェッチポリシー**
- **cache-first（デフォルト）**: まずキャッシュを確認し、データがあればそれを使用。なければネットワークから取得
- **cache-only**: キャッシュのみを使用し、ネットワークリクエストを一切行わない
- **network-only**: キャッシュを無視して、常にネットワークから最新データを取得
- **cache-and-network**: キャッシュのデータを即座に返しつつ、同時にネットワークからも取得して更新

### 4.2 キャッシュポリシーの動作確認コンポーネント

このコンポーネントの目的は以下の4つです。

- **異なるフェッチポリシーの動作を実際に確認する**
- **refetch機能を使ったデータの再取得方法を学ぶ**
- **networkStatusを使ったネットワーク状態の監視**
- **キャッシュの実用的な活用方法を理解する**

`src/components/CacheExample.js`を作成します。

```javascript
import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_COUNTRIES_LIMITED = gql`
  query GetCountriesLimited {
    countries {
      code
      name
      emoji
    }
  }
`;

function CacheExample() {
  const [fetchPolicy, setFetchPolicy] = useState('cache-first');
  const [lastFetch, setLastFetch] = useState(new Date().toLocaleTimeString());
  
  const { loading, error, data, refetch, networkStatus } = useQuery(
    GET_COUNTRIES_LIMITED,
    {
      fetchPolicy: fetchPolicy,
      notifyOnNetworkStatusChange: true,
    }
  );

  const handleRefetch = () => {
    console.log('通常の再取得実行');
    setLastFetch(new Date().toLocaleTimeString());
    refetch();
  };

  const handleCacheFirst = () => {
    console.log('キャッシュ優先で実行');
    setFetchPolicy('cache-first');
    setLastFetch(new Date().toLocaleTimeString());
    refetch();
  };

  const handleNetworkOnly = () => {
    console.log('ネットワークのみで実行');
    setFetchPolicy('network-only');
    setLastFetch(new Date().toLocaleTimeString());
    refetch();
  };

  const handleCacheOnly = () => {
    console.log('キャッシュのみで実行');
    setFetchPolicy('cache-only');
    setLastFetch(new Date().toLocaleTimeString());
    refetch();
  };

  // NetworkStatusの説明
  const getNetworkStatusText = (status) => {
    const statusMap = {
      1: 'loading（初回読み込み中）',
      2: 'setVariables（変数変更中）',
      3: 'fetchMore（追加取得中）',
      4: 'refetch（再取得中）',
      6: 'poll（ポーリング中）',
      7: 'ready（準備完了）',
      8: 'error（エラー）'
    };
    return statusMap[status] || `不明（${status}）`;
  };

  if (loading && networkStatus !== 4) return <p>読み込み中... ({getNetworkStatusText(networkStatus)})</p>;
  if (error) return <p>エラー: {error.message}</p>;

  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
      <h3>キャッシュの動作確認</h3>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleRefetch} style={{ margin: '5px' }}>
          再取得
        </button>
        <button onClick={handleCacheFirst} style={{ margin: '5px' }}>
          キャッシュ優先
        </button>
        <button onClick={handleNetworkOnly} style={{ margin: '5px' }}>
          ネットワークのみ
        </button>
        <button onClick={handleCacheOnly} style={{ margin: '5px' }}>
          キャッシュのみ
        </button>
      </div>
      <div style={{ background: '#f5f5f5', padding: '10px', margin: '10px 0' }}>
        <p><strong>現在のフェッチポリシー:</strong> {fetchPolicy}</p>
        <p><strong>取得した国の数:</strong> {data?.countries?.length}</p>
        <p><strong>ネットワーク状態:</strong> {getNetworkStatusText(networkStatus)}</p>
        <p><strong>最後の実行時刻:</strong> {lastFetch}</p>
        <p><strong>読み込み中:</strong> {loading ? 'はい' : 'いいえ'}</p>
      </div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        <p><strong>💡 ヒント:</strong></p>
        <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
          <li><strong>キャッシュ優先:</strong> キャッシュがあれば即座に表示（ネットワーク不要）</li>
          <li><strong>ネットワークのみ:</strong> 必ずサーバーから最新データを取得</li>
          <li><strong>キャッシュのみ:</strong> ネットワークを使わずキャッシュのみ使用</li>
        </ul>
      </div>
    </div>
  );
}

export default CacheExample;
```

## Step 5: エラーハンドリングとローディング状態

### 5.1 高度なエラーハンドリング

このコンポーネントでは、実際のアプリケーションで重要となるエラーハンドリングについて学びます。目的は以下の4つです。

- **GraphQLクエリで発生するエラーの適切な処理方法を学ぶ**
- **errorPolicyオプションの使い方を理解する**
- **ユーザーフレンドリーなエラー表示とリトライ機能の実装**
- **onErrorコールバックでのエラーログ出力**

`src/components/ErrorExample.js`を作成します。

```javascript
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

// エラーテスト用のクエリ（無効な国コードでエラーを発生させる）
const GET_COUNTRY_WITH_ERROR = gql`
  query GetCountryWithPossibleError($code: ID!) {
    country(code: $code) {
      name
      code
      emoji
    }
  }
`;

function ErrorExample() {
  // 意図的に無効な国コードを初期値に設定
  const [countryCode, setCountryCode] = useState('INVALID');
  
  const { loading, error, data, refetch } = useQuery(GET_COUNTRY_WITH_ERROR, {
    variables: { code: countryCode },
    errorPolicy: 'all', // エラーがあってもデータを返す（部分的データも取得）
    onError: (error) => {
      // エラー発生時のコールバック（ログ出力やアナリティクス送信等に使用）
      console.log('GraphQLエラー:', error);
    },
  });

  // リトライボタンのハンドラー
  const handleRetry = () => {
    refetch(); // 同じ変数でクエリを再実行
  };

  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
      <h3>エラーハンドリングの例</h3>
      <div>
        <label>
          国コード (無効なコードでエラーテスト): 
          <input 
            value={countryCode} 
            onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      {/* ローディング状態の表示 */}
      {loading && <p style={{ color: 'blue' }}>読み込み中...</p>}
      
      {/* エラー状態の詳細な表示とリトライ機能 */}
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          <p><strong>エラーが発生しました:</strong></p>
          <p>{error.message}</p>
          <button onClick={handleRetry}>再試行</button>
        </div>
      )}

      {/* データが正常に取得できた場合の表示 */}
      {data?.country && (
        <div style={{ color: 'green' }}>
          <p>✅ 正常に取得: {data.country.emoji} {data.country.name}</p>
        </div>
      )}
    </div>
  );
}

export default ErrorExample;
```

### 5.2 全てのコンポーネントを統合

`src/App.js`を最終版に更新します。

```javascript
import React from 'react';
import CountryList from './components/CountryList';
import CountryDetail from './components/CountryDetail';
import CacheExample from './components/CacheExample';
import ErrorExample from './components/ErrorExample';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ color: 'black', background: 'white' }}>
        <h1>Apollo Client チュートリアル</h1>
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <CountryDetail />
          <CacheExample />
          <ErrorExample />
          <CountryList />
        </div>
      </header>
    </div>
  );
}

export default App;
```

## まとめ

このハンズオンを通じて、以下のApollo Clientの基本機能を学びました。

### 学んだこと
- **基本設定**: Apollo Clientのインスタンス作成とApolloProviderの設定
- **useQueryフック**: GraphQLクエリの実行と結果の取得
- **変数の使用**: パラメータ付きクエリの実装
- **キャッシュ管理**: フェッチポリシーとrefetchの活用
- **エラーハンドリング**: 適切なエラー処理とユーザーエクスペリエンス