import React from 'react';
import './App.css';
import CurrencyConverter from './components/CurrencyConverter';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Money Converter</h1>
      </header>
      <main>
        <CurrencyConverter />
      </main>
    </div>
  );
}

export default App;