import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Music, Plus } from 'lucide-react';

const mockRecords = [
  { id: 1, title: 'Symphony No. 5', ensemble: 'Berlin Philharmonic', retail_price: 1500, stock: 50, image: null },
  { id: 2, title: 'Jazz Classics', ensemble: 'Miles Davis Quartet', retail_price: 1200, stock: 35, image: null },
  { id: 3, title: 'Rock Legends', ensemble: 'The Beatles', retail_price: 1800, stock: 20, image: null },
  { id: 4, title: 'Classical Piano', ensemble: 'Vienna Philharmonic', retail_price: 1400, stock: 40, image: null },
];

export default function Catalog() {
  const { canBuy, user } = useAuth();
  const { addToCart } = useCart();
  const [records] = useState(mockRecords);

  const handleAddToCart = (record) => {
    if (!canBuy()) {
      alert('Только зарегистрированные пользователи могут добавлять товары в корзину');
      return;
    }
    addToCart(record);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Каталог пластинок</h1>
      
      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            👋 Вы просматриваете как гость. <br />
            <span className="text-sm">Зарегистрируйтесь или войдите, чтобы добавлять товары в корзину и совершать покупки.</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {records.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {record.image ? (
                <img src={record.image} alt={record.title} className="w-full h-full object-cover" />
              ) : (
                <Music className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 truncate">{record.title}</h3>
              <p className="text-gray-600 text-sm mb-2 truncate">{record.ensemble}</p>
              <div className="flex justify-between items-center">
                <p className="text-blue-600 font-semibold">{record.retail_price} ₽</p>
                <button
                  onClick={() => handleAddToCart(record)}
                  disabled={!canBuy()}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 text-sm ${
                    canBuy()
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  В корзину
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">В наличии: {record.stock} шт.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
