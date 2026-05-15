import { useEffect, useState } from 'react';

const API = 'http://localhost:3001/api';

export default function RecordTable() {
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => fetch(`${API}/records`).then(r => r.json()).then(setRecords);
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Удалить пластинку? Связанные треки удалятся автоматически.')) return;
    try {
      await fetch(`${API}/records/${id}`, { method: 'DELETE' });
      load();
    } catch (err) { alert('Ошибка удаления'); }
  };

  const handleSave = async (id, data) => {
    try {
      await fetch(`${API}/records/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setEditing(null);
      load();
    } catch (err) { alert('Ошибка обновления'); }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow overflow-x-auto">
      <h3 className="text-lg font-bold mb-3">📋 Все пластинки</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">№</th><th className="p-2 text-left">Название</th>
            <th className="p-2 text-left">Цена</th><th className="p-2 text-left">Продано (год)</th>
            <th className="p-2 text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.record_id} className="border-t">
              {editing === r.record_id ? (
                <td colSpan="5" className="p-2">
                  <input defaultValue={r.title} id="edit-title" className="border p-1 mr-2" />
                  <input defaultValue={r.retail_price} id="edit-price" type="number" step="0.01" className="border p-1 mr-2" />
                  <button onClick={() => handleSave(r.record_id, {
                    title: document.getElementById('edit-title').value,
                    retail_price: document.getElementById('edit-price').value
                  })} className="text-green-600 mr-2">💾</button>
                  <button onClick={() => setEditing(null)} className="text-gray-500">✖</button>
                </td>
              ) : (
                <>
                  <td className="p-2">{r.label_number}</td>
                  <td className="p-2">{r.title}</td>
                  <td className="p-2">₽{r.retail_price}</td>
                  <td className="p-2">{r.copies_sold_current_year}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => setEditing(r.record_id)} className="text-blue-600">✏️</button>
                    <button onClick={() => handleDelete(r.record_id)} className="text-red-600">🗑️</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}