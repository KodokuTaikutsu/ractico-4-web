import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [proofFile, setProofFile] = useState(null);

  useEffect(() => {
    api.get(`/ads/${id}`).then(res => setAd(res.data)).catch(console.error);
    api.get('/wallets').then(res => setWallets(res.data)).catch(console.error);
  }, [id]);

  const startTransaction = () => {
    api.post('/transactions', {
      adId: ad.id,
      toWalletId: selectedWallet,
      amount: parseFloat(amount)
    }).then(res => setTransaction(res.data))
      .catch(console.error);
  };

  const uploadProof = () => {
    if (!transaction || !proofFile) return;
    const formData = new FormData();
    formData.append('proof', proofFile);

    api.post(`/transactions/${transaction.id}/proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => alert('Proof uploaded!'))
      .catch(console.error);
  };

  const completeTransaction = () => {
    api.patch(`/transactions/${transaction.id}/complete`)
      .then(() => {
        alert('Transaction completed');
        navigate('/transactions');
      })
      .catch(console.error);
  };

  const cancelTransaction = () => {
    api.patch(`/transactions/${transaction.id}/cancel`)
      .then(() => {
        alert('Transaction cancelled');
        navigate('/transactions');
      })
      .catch(console.error);
  };

  if (!ad) return <p>Loading ad...</p>;

  return (
    <div>
      <h2>Ad Detail</h2>
      <p><strong>Type:</strong> {ad.type}</p>
      <p><strong>Coin:</strong> {ad.Coin?.name}</p>
      <p><strong>Price:</strong> ${ad.pricePerUnit}</p>
      <p><strong>Quantity:</strong> {ad.quantity}</p>

      {!transaction ? (
        <div>
          <h3>Start Transaction</h3>
          <label>Choose Wallet:</label>
          <select value={selectedWallet} onChange={e => setSelectedWallet(e.target.value)}>
            <option value="">Select Wallet</option>
            {wallets.map(w => (
              <option key={w.id} value={w.id}>{w.Coin?.name} - Balance: {w.balance}</option>
            ))}
          </select>

          <br />

          <label>Amount:</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />

          <br />

          <button onClick={startTransaction}>Start</button>
        </div>
      ) : (
        <div>
          <h3>Transaction Started (ID: {transaction.id})</h3>

          <label>Upload Proof of Payment:</label>
          <input type="file" onChange={e => setProofFile(e.target.files[0])} />
          <button onClick={uploadProof}>Upload</button>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={completeTransaction}>Approve (Complete)</button>
            <button onClick={cancelTransaction}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}