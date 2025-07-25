import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_COUNTRY_WITH_ERROR = gql`
   query GetCountryWithPossibleError($code: ID!) {
       country(code: $code) {
           code
           name
           emoji
       }
   }
`;

const ErrorExample = () => {
    const [countryCode, setCountryCode] = useState('INVALID');

    const { loading, error, data, refetch } = useQuery(
        GET_COUNTRY_WITH_ERROR,
        {
            variables: { code: countryCode },
            errorPolicy: 'all', // エラーが発生してもデータを返す
            onError: (error) => {
                console.error('GraphQL Error:', error);
            },
        }
    );

    const handleRetry = () => {
        refetch();
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

            {loading && <p style={{ color: 'blue'}}>読み込み中...</p>}

            {error && (
                <div>
                    <p style={{ color: 'red', margin: '10px 0' }}>エラーが発生しました: {error.message}</p>
                    <button onClick={handleRetry}>再試行</button>
                </div>
            )}

            {data?.country && (
                <div style={{ color: 'green' }}>
                    <p>✅ 正常に取得: {data.country.emoji} {data.country.name}</p>
                </div>
            )}
        </div>
    );
};

export default ErrorExample;
