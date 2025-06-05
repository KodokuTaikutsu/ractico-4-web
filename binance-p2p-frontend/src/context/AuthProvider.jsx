// src/context/AuthProvider.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (token && username && role) {
      setUser({ username, role });
    }
  }, []);

  const login = (data) => {
    const { token, user } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('username', user.username);
    localStorage.setItem('role', user.role);
    setUser(user); // 👈 this updates the context so Navbar re-renders
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
