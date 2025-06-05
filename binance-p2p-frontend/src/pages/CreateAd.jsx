import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CreateAd() {
  const [coins, setCoins] = useState([]);
  const [form, setForm] = useState({
    coinId: '',
    type: 'sell',
    pricePerUnit: '',
    quantity: '',
    paymentInstructions: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/coins')
      .then(res => setCoins(res.data))
      .catch(console.error);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/ads', form);
      navigate('/ads');
    } catch (err) {
      console.error(err);
      alert('Failed to create ad');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Create Advertisement</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type:</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="sell">Sell</option>
            <option value="buy">Buy</option>
          </select>
        </div>
        <div>
          <label>Coin:</label>
          <select name="coinId" value={form.coinId} onChange={handleChange} required>
            <option value="">-- Select Coin --</option>
            {coins.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Price Per Unit:</label>
          <input name="pricePerUnit" type="number" step="0.01" value={form.pricePerUnit} onChange={handleChange} required />
        </div>
        <div>
          <label>Quantity:</label>
          <input name="quantity" type="number" step="0.01" value={form.quantity} onChange={handleChange} required />
        </div>
        <div>
          <label>Payment Instructions:</label>
          <textarea name="paymentInstructions" value={form.paymentInstructions} onChange={handleChange} />
        </div>
        <button type="submit">Create Ad</button>
      </form>
    </div>
  );
}
