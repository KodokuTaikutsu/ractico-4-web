import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function WalletDetail() {
  const { id } = useParams();
  const [wallet, setWallet] = useState(null);

  

  useEffect(() => {
    api.get(`/wallets/${id}`).then(res => setWallet(res.data)).catch(console.error);
  }, [id]);

  if (!wallet) return <p>Loading...</p>;

  return (
    <div>
      <h2>Wallet Detail</h2>
      <p>Coin: {wallet.Coin?.name}</p>
      <p>Balance: {wallet.balance}</p>
      <h3>Transactions</h3>
      <ul>
        {(wallet.sentTransactions || []).map(tx => (
          <li key={tx.id}>Sent {tx.amount} to {tx.toWalletId}</li>
        ))}
        {(wallet.receivedTransactions || []).map(tx => (
          <li key={tx.id}>Received {tx.amount} from {tx.fromWalletId}</li>
        ))}
      </ul>
    </div>
  );
}