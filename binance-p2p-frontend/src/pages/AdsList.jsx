import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Marketplace() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    api.get('/ads')
      .then(res => setAds(res.data))
      .catch(err => console.error('Error fetching ads:', err));
  }, []);

  return (
    <div>
      <h2>Available Ads</h2>
      <ul>
        {ads.map(ad => (
          <li key={ad.id}>
            <strong>{ad.type.toUpperCase()}</strong> | {ad.Coin?.name || 'Unknown Coin'} | 
            Price: ${ad.pricePerUnit} | Qty: {ad.amountAvailable}
            {ad.status !== 'open' && <> ({ad.status})</>}
            {' '}<Link to={`/ads/${ad.id}`}>Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
