import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://your-backend-url.up.railway.app'; // Replace with your backend URL

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [owner, setOwner] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // default to today in YYYY-MM-DD
  });

  const fetchTransactions = async () => {
    const res = await axios.get(`${API_URL}/transactions`);
    setTransactions(res.data);
  };

  const addTransaction = async () => {
    if (!amount || !owner) return alert('Please enter amount and owner');
    await axios.post(`${API_URL}/transactions`, {
      amount: parseFloat(amount),
      type,
      owner,
      date, // already in YYYY-MM-DD format
    });
    setAmount('');
    setOwner('');
    setDate(new Date().toISOString().split('T')[0]);
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Transactions</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Owner"
          value={owner}
          onChange={e => setOwner(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <button onClick={addTransaction}>Add</button>
      </div>

      <ul>
        {transactions.map((t, i) => (
          <li key={i}>
            {t.owner} – {t.type} – ${t.amount} – {t.date || 'no date'}
          </li>
        ))}
      </ul>
    </div>
  );
}
