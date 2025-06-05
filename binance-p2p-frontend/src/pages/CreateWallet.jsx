import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CreateWallet() {
  const [coinId, setCoinId] = useState('');
  const [coins, setCoins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/coins')
      .then(res => setCoins(res.data))
      .catch(err => console.error('Error fetching coins', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/wallets', { coinId });
      navigate('/wallets');
    } catch (err) {
      console.error('Error creating wallet', err);
    }
  };

  return (
    <div>
      <h2>Create Wallet</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select Coin:
          <select value={coinId} onChange={e => setCoinId(e.target.value)} required>
            <option value="">--Select--</option>
            {coins.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Create Wallet</button>
      </form>
    </div>
  );
}
