import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function RecordsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/records`)
      .then(res => res.ok ? res.json() : Promise.reject('Ошибка сервера'))
      .then(setRecords)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">⏳ Загрузка каталога...</p>;
  if (error) return <p className="p-4 text-red-600">❌ {error}</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📀 Каталог пластинок</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map(r => (
          <div key={r.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <h3 className="font-semibold text-lg">№ {r.label_number}</h3>
            <p className="text-sm text-gray-600">Лейбл: {r.company_name}</p>
            <p className="text-sm text-gray-600">Дата выпуска: {new Date(r.release_date).toLocaleDateString()}</p>
            <div className="mt-2 flex justify-between">
              <span className="text-green-700 font-medium">₽{r.retail_price}</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">Остаток: {r.stock_count}</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Продано в этом году: {r.sold_current_year} | В прошлом: {r.sold_last_year}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}