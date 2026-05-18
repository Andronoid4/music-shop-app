import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Music, Plus } from 'lucide-react';

export default function Catalog() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { canBuy, user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:3001/api/records')
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load records:', err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (record) => {
    if (!canBuy()) {
      alert('Только зарегистрированные пользователи могут добавлять товары в корзину');
      return;
    }
    addToCart(record);
  };

  if (loading) return <div className="p-6 text-center">Загрузка...</div>;

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
          <div key={record.record_id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <Music className="w-16 h-16 text-gray-400" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 truncate">{record.title}</h3>
              <p className="text-gray-600 text-sm mb-2 truncate">{record.company_name || 'Неизвестный лейбл'}</p>
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
              <p className="text-xs text-gray-500 mt-2">В наличии: {record.stock_quantity} шт.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}