import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Music, UserPlus, LogIn } from 'lucide-react';

export default function Login() {
  const { login, register, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = isLogin ? await login(username, password) : await register(username, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Вы уже вошли</h2>
          <p className="text-gray-600">{user.username} ({user.role})</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {isLogin ? <LogIn className="w-8 h-8 text-blue-600" /> : <UserPlus className="w-8 h-8 text-blue-600" />}
          </div>
          <h2 className="text-xl font-bold mb-2">{isLogin ? 'Вход' : 'Регистрация'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-blue-600 hover:underline"
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
}