import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogIn, LogOut, Music } from 'lucide-react';

export default function Login() {
  const { user, login, logout } = useAuth();
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      login(name, selectedRole);
    }
  };

  const handleQuickLogin = (role) => {
    login(`Пользователь ${role}`, role);
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Вы вошли как</h2>
          <p className="text-lg text-gray-800 mb-1">{user.name}</p>
          <p className="text-sm text-gray-500 mb-6">
            Роль: {user.role === 'owner' && 'Владелец'}
            {user.role === 'admin' && 'Администратор'}
            {user.role === 'user' && 'Пользователь'}
          </p>
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Вход в систему</h2>
          <p className="text-gray-600 text-sm">Выберите роль для демонстрации</p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleQuickLogin('owner')}
            className="w-full p-4 border-2 border-purple-200 hover:border-purple-400 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold">Владелец</p>
                <p className="text-xs text-gray-500">Полный доступ, блокировка пользователей</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleQuickLogin('admin')}
            className="w-full p-4 border-2 border-blue-200 hover:border-blue-400 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Администратор</p>
                <p className="text-xs text-gray-500">Управление товарами</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleQuickLogin('user')}
            className="w-full p-4 border-2 border-green-200 hover:border-green-400 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Пользователь</p>
                <p className="text-xs text-gray-500">Покупки и корзина</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => login(null, 'guest')}
            className="w-full p-4 border-2 border-gray-200 hover:border-gray-400 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold">Гость</p>
                <p className="text-xs text-gray-500">Только просмотр</p>
              </div>
            </div>
          </button>
        </div>

        <div className="border-t pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Или введите имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
              <option value="owner">Владелец</option>
            </select>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
