import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { canBuy, user } = useAuth();

  const handleCheckout = () => {
    if (!canBuy()) {
      alert('Только зарегистрированные пользователи могут совершать покупки');
      return;
    }
    if (cart.length === 0) {
      alert('Корзина пуста');
      return;
    }
    alert(`Заказ оформлен на сумму ${total} ₽!`);
    clearCart();
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Корзина
        </h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 mb-4">
            Для покупок необходимо войти в систему или зарегистрироваться
          </p>
          <p className="text-sm text-yellow-700">
            Гости могут только просматривать каталог
          </p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Корзина
        </h1>
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Ваша корзина пуста</p>
          <p className="text-gray-500 text-sm mt-2">Добавьте товары из каталога</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6" />
        Корзина
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Товар</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Цена</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Количество</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Сумма</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cart.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.ensemble}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900">{item.retail_price} ₽</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-semibold">
                  {item.retail_price * item.quantity} ₽
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Итого:</span>
          <span className="text-2xl font-bold text-blue-600">{total} ₽</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={!canBuy()}
          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
            canBuy()
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          Оформить заказ
        </button>
      </div>
    </div>
  );
}
