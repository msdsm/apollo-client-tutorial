import React from 'react';
import { useState } from 'react';
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

const CacheExample = () => {
    const [fetchPolicy, setFetchPolicy] = useState('cache-first');
    const [lastFetch, setLastFetch] = useState(new Date().toLocaleTimeString());

    const { loading, error, data, refetch, networkStatus } = useQuery(
        GET_COUNTRIES_LIMITED,
        {
            fetchPolicy: fetchPolicy,
            notifyOnNetworkStatusChange: true, // ネットワークステータスの変更を通知
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
            8: 'error（エラー）',
        };
        return statusMap[status] || `不明(${status})`;
    };

    if (loading && networkStatus !== 4) return <p>読み込み中... (NetworkStatus: {getNetworkStatusText(networkStatus)})</p>;
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
            <div style={{ background: '#00000000', padding: '10px', margin: '10px 0' }}>
                <p><strong>現在のフェッチポリシー:</strong> {fetchPolicy}</p>
                <p><strong>取得した国の数:</strong> {data?.countries?.length}</p>
                <p><strong>ネットワーク状態:</strong> {getNetworkStatusText(networkStatus)}</p>
                <p><strong>最終取得時刻:</strong> {lastFetch}</p>
            </div>
        </div>
    );  
};

export default CacheExample;