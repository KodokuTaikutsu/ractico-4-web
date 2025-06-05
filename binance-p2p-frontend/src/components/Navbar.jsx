import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>

      {user ? (
        <>
          <span style={{ marginRight: '1rem' }}>Hello, {user.username}!</span>
          <Link to="/wallets" style={{ marginRight: '1rem' }}>Wallets</Link>
          <Link to="/ads" style={{ marginRight: '1rem' }}>Marketplace</Link>
          <Link to="/ads/create" style={{ marginRight: '1rem' }}>Create Ad</Link>

          {user.role === 'admin' && (
            <Link to="/admin" style={{ marginRight: '1rem' }}>Admin Panel</Link>
          )}

          <button onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
