import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, BanCheck } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Иван', role: 'user', banned: false },
  { id: 2, name: 'Петр', role: 'user', banned: false },
  { id: 3, name: 'Анна', role: 'user', banned: false },
];

export default function AdminPanel() {
  const { canBan } = useAuth();
  const [users, setUsers] = useState(mockUsers);

  const toggleBan = (id) => {
    if (!canBan()) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, banned: !u.banned } : u))
    );
  };

  if (!canBan()) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg">
        <BanCheck className="w-12 h-12 mx-auto mb-2" />
        <p>Доступ запрещен. Только владелец может управлять пользователями.</p>
      </div>
    );
  }

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
              <tr key={user.id} className={user.banned ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.role}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.banned
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {user.banned ? 'Заблокирован' : 'Активен'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleBan(user.id)}
                    className={`px-3 py-1 text-sm rounded ${
                      user.banned
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {user.banned ? 'Разблокировать' : 'Заблокировать'}
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
