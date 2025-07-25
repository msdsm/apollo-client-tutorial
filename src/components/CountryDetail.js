import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_COUNTRY = gql`
    query GetCountry($code: ID!) {
        country(code: $code) {
            name
            code
            emoji
            currency
            languages {
                name
            }
            continent {
                name
            }
        }
    }
`;

const CountryDetail = () => {
    const [countryCode, setCountryCode] = useState('JP');

    const { loading, error, data } = useQuery(GET_COUNTRY, {
        variables: { code: countryCode },
    });

    if (loading) return <p>読み込み中...</p>;
    if (error) return <p>エラー: {error.message}</p>;

    const country = data.country;

    return (
        <div style={{margin: '20px 0', padding: '20px', border: '1px solid #ccc'}}>
            <h3>国の詳細情報</h3>
            <div>
                <label>
                    国コード:
                    <input
                        type="text"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                        style={{ marginLeft: '10px' }}
                        placeholder="例: JP, US, FR"
                    />
                </label>
            </div>

            {country && (
                <div>
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