import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './auth/Login';
import Register from './auth/Register';
import Wallets from './pages/Wallets';
import WalletDetail from './pages/WalletDetail';
import AdsList from './pages/AdsList';
import CreateAd from './pages/CreateAd';
import AdminDashboard from './pages/AdminDahsboard';
import Home from './pages/Home';
import CreateWallet from './pages/CreateWallet'; 
import AdDetail from './pages/AdDetail';




const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wallets" element={<PrivateRoute><Wallets /></PrivateRoute>} />
        <Route path="/wallets/create" element={<PrivateRoute><CreateWallet /></PrivateRoute>} /> 
        <Route path="/wallets/:id" element={<PrivateRoute><WalletDetail /></PrivateRoute>} />
        <Route path="/ads" element={<PrivateRoute><AdsList /></PrivateRoute>} />
        <Route path="/ads/create" element={<PrivateRoute><CreateAd /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/ads/:id" element={<PrivateRoute><AdDetail /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
