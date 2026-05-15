import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music, ShoppingCart, TrendingUp, Package, Users, UserPlus } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Добро пожаловать в MusicShop</h1>
        <p className="text-blue-100 mb-6">
          Лучший магазин классической и джазовой музыки
        </p>
        <Link
          to="/catalog"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Перейти в каталог
        </Link>
      </div>

      {/* Quick actions based on role */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/catalog"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-lg mb-1">Каталог</h3>
          <p className="text-gray-600 text-sm">Просмотр всех пластинок</p>
        </Link>

        <Link
          to="/bestsellers"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-lg mb-1">Лидеры продаж</h3>
          <p className="text-gray-600 text-sm">Топ пластинок года</p>
        </Link>

        {!user && (
          <Link
            to="/login"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-1">Войти</h3>
            <p className="text-gray-600 text-sm">Для покупок и корзины</p>
          </Link>
        )}

        {user?.role === 'admin' || user?.role === 'owner' ? (
          <Link
            to="/admin/records"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Music className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-bold text-lg mb-1">Товары</h3>
            <p className="text-gray-600 text-sm">Управление пластинками</p>
          </Link>
        ) : null}

        {user?.role === 'owner' ? (
          <Link
            to="/admin/users"
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mb-1">Пользователи</h3>
            <p className="text-gray-600 text-sm">Управление доступом</p>
          </Link>
        ) : null}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg mb-2">🎵 Огромный выбор</h3>
          <p className="text-gray-600 text-sm">
            Классическая музыка, джаз, рок и другие жанры. Пластинки от лучших мировых исполнителей.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg mb-2">🚀 Быстрая доставка</h3>
          <p className="text-gray-600 text-sm">
            Оперативная обработка заказов и доставка по всей стране.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg mb-2">💳 Удобная оплата</h3>
          <p className="text-gray-600 text-sm">
            Различные способы оплаты: карты, электронные кошельки, наличные.
          </p>
        </div>
      </div>

      {/* System info */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">О системе</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><strong>Роли пользователей:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Гость — только просмотр</li>
              <li>Пользователь — покупки и корзина</li>
              <li>Администратор — управление товарами</li>
              <li>Владелец — полный доступ + блокировка</li>
            </ul>
          </div>
          <div>
            <p><strong>Функционал:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Каталог пластинок с обложками</li>
              <li>Корзина и оформление заказов</li>
              <li>Рейтинг лидеров продаж</li>
              <li>Админ-панель для управления</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
