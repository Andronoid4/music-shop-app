import { useEffect, useState } from 'react';

const API = 'http://localhost:3001/api';

export default function Bestsellers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/records/bestsellers`)
      .then(r => r.json())
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>⏳ Загрузка лидеров...</p>;

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h3 className="text-xl font-bold mb-3">🏆 Лидеры продаж (текущий год)</h3>
      {items.length === 0 ? (
        <p className="text-gray-500">Нет данных</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-medium">{it.label_number} — {it.record_title}</span>
              <span className="text-green-700 font-bold">{it.copies_sold} продано</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
