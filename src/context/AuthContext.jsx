import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('music_shop_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Функция входа: принимает name и role (для демо)
  const login = (name, role) => {
    // Проверка на бан (для пользователя с ролью user)
    if (role === 'user' && name === 'banned') {
      return { success: false, message: 'Ваш аккаунт заблокирован.' };
    }
    const newUser = {
      id: Date.now(),
      name: name || (role === 'owner' ? 'Владелец' : role === 'admin' ? 'Администратор' : 'Пользователь'),
      email: `${role}@shop.com`,
      role: role,
      isBanned: false
    };
    setUser(newUser);
    localStorage.setItem('music_shop_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('music_shop_user');
  };

  // Проверка прав
  const canBuy = () => {
    return user && user.role !== 'guest';
  };

  const canEdit = () => {
    return user && (user.role === 'admin' || user.role === 'owner');
  };

  const canBan = () => {
    return user && user.role === 'owner';
  };

  const banUser = (userId) => {
    if (!canBan()) return;
    // В реальном приложении был бы API-запрос
    alert(`Пользователь с ID ${userId} заблокирован (симуляция)`);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, banUser, canBuy, canEdit, canBan, isAuthenticated: !!user }}>
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
