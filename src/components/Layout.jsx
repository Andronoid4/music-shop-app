import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Music, ShoppingCart, User, Home, TrendingUp, Package, Users, LogIn } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная', icon: Home },
    { path: '/catalog', label: 'Каталог', icon: Package },
    { path: '/bestsellers', label: 'Лидеры продаж', icon: TrendingUp },
  ];

  if (user?.role === 'admin' || user?.role === 'owner') {
    navItems.push({ path: '/admin/records', label: 'Товары', icon: Package });
  }

  if (user?.role === 'owner') {
    navItems.push({ path: '/admin/users', label: 'Пользователи', icon: Users });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MusicShop</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 hidden sm:block">
                    {user.name}
                    <span className="ml-1 text-xs text-gray-400">
                      ({user.role === 'owner' && 'Владелец'}
                       {user.role === 'admin' && 'Админ'}
                       {user.role === 'user' && 'Пользователь'})
                    </span>
                  </span>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <LogIn className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="md:hidden border-t overflow-x-auto">
          <div className="flex px-4 py-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">© 2024 MusicShop. Курсовой проект.</span>
            </div>
            <p className="text-sm text-gray-500">
              База данных музыкального магазина
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
