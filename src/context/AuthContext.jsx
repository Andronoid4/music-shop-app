import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API = 'http://localhost:3001/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (username, password, role = 'user') => {
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // после регистрации сразу логиним
      return await login(username, password);
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const banUser = async (userId, ban) => {
    if (user?.role !== 'owner') return;
    try {
      const res = await fetch(`${API}/users/${userId}/ban`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ban })
      });
      if (!res.ok) throw new Error('Failed to ban user');
    } catch (err) { console.error(err); }
  };

  const getUsers = async () => {
    if (user?.role !== 'owner') return [];
    try {
      const res = await fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return [];
      return await res.json();
    } catch { return []; }
  };

  const canBuy = () => user && !user.isBanned && user.role !== 'guest';
  const canEdit = () => user && (user.role === 'admin' || user.role === 'owner');
  const canBan = () => user && user.role === 'owner';

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, banUser, getUsers, canBuy, canEdit, canBan, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};