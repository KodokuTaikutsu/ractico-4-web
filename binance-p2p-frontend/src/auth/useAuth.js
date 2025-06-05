import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const useAuth = () => {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    login(res.data); // this should call context.login and update state
    navigate('/wallets');
  };

  const register = async (username, email, password) => {
    await api.post('/auth/register', { username, email, password });
    navigate('/login');
  };

  return { user, login: loginUser, register, logout };
};
