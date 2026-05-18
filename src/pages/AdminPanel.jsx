import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users } from 'lucide-react';

export default function AdminPanel() {
  const { user, token, canBan, banUser } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (canBan()) {
      fetch('http://localhost:3001/api/auth/users', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(setUsers);
    }
  }, [canBan, token]);

  const handleBan = async (userId, currentBan) => {
    await banUser(userId, !currentBan);
    // обновить список
    const updated = await fetch('http://localhost:3001/api/auth/users', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
    setUsers(updated);
  };

  const toggleBan = (userId, currentBan) => {
    handleBan(userId, currentBan);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users className="w-6 h-6" />
        Управление пользователями
      </h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Имя</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Роль</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Статус</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.user_id} className={user.is_banned ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 text-sm text-gray-900">{user.user_id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.role}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.is_banned
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {user.is_banned ? 'Заблокирован' : 'Активен'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleBan(user.user_id, user.is_banned)}
                    className={`px-3 py-1 text-sm rounded ${
                      user.is_banned
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {user.is_banned ? 'Разблокировать' : 'Заблокировать'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
