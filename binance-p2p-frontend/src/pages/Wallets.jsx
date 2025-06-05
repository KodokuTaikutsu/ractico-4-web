import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Wallets() {
  const [wallets, setWallets] = useState([]);

  


  useEffect(() => {
    api.get('/wallets').then(res => setWallets(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Your Wallets</h2>

       <Link to="/wallets/create">
        <button>Create New Wallet</button>
      </Link>
      <ul>
        {wallets.map(w => (
          <li key={w.id}>
            <Link to={`/wallets/${w.id}`}>{w.Coin?.name || 'Coin'}: {w.balance}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
