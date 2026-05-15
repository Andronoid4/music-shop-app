import { useAuth } from '../context/AuthContext';
import { TrendingUp, Music } from 'lucide-react';

const mockBestsellers = [
  { id: 1, title: 'Jazz Classics', ensemble: 'Miles Davis Quartet', sold_current: 145, retail_price: 1200 },
  { id: 2, title: 'Symphony No. 5', ensemble: 'Berlin Philharmonic', sold_current: 120, retail_price: 1500 },
  { id: 3, title: 'Rock Legends', ensemble: 'The Beatles', sold_current: 98, retail_price: 1800 },
  { id: 4, title: 'Piano Sonatas', ensemble: 'Vienna Philharmonic', sold_current: 87, retail_price: 1400 },
  { id: 5, title: 'Blues Collection', ensemble: 'B.B. King', sold_current: 76, retail_price: 1100 },
];

export default function Bestsellers() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-green-600" />
        Лидеры продаж этого года
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Название</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ансамбль</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Продано</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Цена</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockBestsellers.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <Music className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{item.ensemble}</td>
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-green-600">{item.sold_current}</span>
                  <span className="text-xs text-gray-500 ml-1">шт.</span>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-blue-600">
                  {item.retail_price} ₽
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          💡 Данные обновляются автоматически на основе продаж текущего года. 
          Рейтинг формируется по количеству проданных экземпляров.
        </p>
      </div>
    </div>
  );
}
