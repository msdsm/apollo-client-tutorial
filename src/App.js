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
