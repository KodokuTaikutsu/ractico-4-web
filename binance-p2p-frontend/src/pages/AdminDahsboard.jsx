// src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [coins, setCoins] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCoin, setNewCoin] = useState({ name: '', valueInUSD: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get('/admin/coins').then(res => setCoins(res.data));
    api.get('/admin/users').then(res => setUsers(res.data));
  };

  const handleCoinChange = (e) => {
    const { name, value } = e.target;
    setNewCoin(prev => ({ ...prev, [name]: value }));
  };

  const addCoin = async () => {
    await api.post('/admin/coins', newCoin);
    setNewCoin({ name: '', valueInUSD: '' });
    fetchData();
  };

  const updateCoin = async (id, name, valueInUSD) => {
    await api.put(`/admin/coins/${id}`, { name, valueInUSD });
    fetchData();
  };

  const deleteCoin = async (id) => {
    await api.delete(`/admin/coins/${id}`);
    fetchData();
  };

  const promoteUser = async (id) => {
    await api.patch(`/admin/users/${id}/promote`);
    fetchData();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Manage Coins</h3>
      <input name="name" placeholder="Name" value={newCoin.name} onChange={handleCoinChange} />
      <input name="valueInUSD" placeholder="Value in USD" type="number" value={newCoin.valueInUSD} onChange={handleCoinChange} />
      <button onClick={addCoin}>Add Coin</button>

      <ul>
        {coins.map(c => (
          <li key={c.id}>
            <input defaultValue={c.name} onBlur={e => updateCoin(c.id, e.target.value, c.valueInUSD)} />
            <input type="number" defaultValue={c.valueInUSD} onBlur={e => updateCoin(c.id, c.name, e.target.value)} />
            <button onClick={() => deleteCoin(c.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Manage Users</h3>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.username} ({u.email}) - {u.role}
            {u.role !== 'admin' && (
              <button onClick={() => promoteUser(u.id)}>Promote to Admin</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
