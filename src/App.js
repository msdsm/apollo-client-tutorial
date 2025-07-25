import React from 'react';
import CountryList from './components/CountryList';
import CountryDetail from './components/CountryDetail';
import CacheExample from './components/CacheExample';
import ErrorExample from './components/ErrorExample';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Apollo Client チュートリアル</h1>
        <CountryDetail />
        <CacheExample />
        <ErrorExample />
        <CountryList />
      </header>
    </div>
  );
}

export default App;
