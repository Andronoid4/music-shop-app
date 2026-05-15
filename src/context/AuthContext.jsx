import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = гость, иначе { name, role }

  const login = (name, role) => {
    setUser({ name, role });
  };

  const logout = () => {
    setUser(null);
  };

  const canBan = () => user?.role === 'owner';
  const canEdit = () => user?.role === 'admin' || user?.role === 'owner';
  const canBuy = () => user?.role === 'user' || user?.role === 'admin' || user?.role === 'owner';

  return (
    <AuthContext.Provider value={{ user, login, logout, canBan, canEdit, canBuy }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
