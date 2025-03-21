import { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const API_URL = 'https://your-backend-url.up.railway.app'; // Replace with your backend

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [owner, setOwner] = useState('');
  const [date, setDate] = useState(new Date());

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
      date: date.toISOString().split('T')[0], // format YYYY-MM-DD
    });
    setAmount('');
    setOwner('');
    setDate(new Date());
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
        <DatePicker selected={date} onChange={setDate} />
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
