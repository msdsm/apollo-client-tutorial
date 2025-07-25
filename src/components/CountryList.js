import React from 'react';
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

const CountryList = () => {
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