import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState();
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rates?base=USD');
        const currencyList = Object.keys(response.data.rates);
        setCurrencies(currencyList.map(currency => ({ value: currency, label: currency })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching currencies:', error);
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      const fetchExchangeRate = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
          );
          setExchangeRate(response.data.rate);
          setConvertedAmount(response.data.result);
        } catch (error) {
          console.error('Error fetching exchange rate:', error);
        }
      };

      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency, amount]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFromCurrencyChange = (selectedOption) => {
    setFromCurrency(selectedOption.value);
  };

  const handleToCurrencyChange = (selectedOption) => {
    setToCurrency(selectedOption.value);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  if (loading) {
    return <div>Loading currencies...</div>;
  }

  return (
    <div className="converter-container">
      <h2>Currency Converter</h2>
      <div className="input-group">
        <div className="input-field">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            min="0"
            step="0.01"
          />
        </div>
        <div className="input-field">
          <label>From</label>
          <Select
            value={{ value: fromCurrency, label: fromCurrency }}
            onChange={handleFromCurrencyChange}
            options={currencies}
          />
        </div>
        <button className="swap-btn" onClick={swapCurrencies}>
          ⇄
        </button>
        <div className="input-field">
          <label>To</label>
          <Select
            value={{ value: toCurrency, label: toCurrency }}
            onChange={handleToCurrencyChange}
            options={currencies}
          />
        </div>
      </div>
      <div className="result">
        <h3>
          {amount} {fromCurrency} = {convertedAmount.toFixed(4)} {toCurrency}
        </h3>
        <p>Exchange rate: 1 {fromCurrency} = {exchangeRate?.toFixed(6) || '...'} {toCurrency}</p>
      </div>
    </div>
  );
};

export default CurrencyConverter;