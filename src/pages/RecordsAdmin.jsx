import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:3001/api';

export default function RecordsAdmin() {
  const { token, canEdit } = useAuth();
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ label_number: '', title: '', company_id: '', release_date: '', wholesale_price: '', retail_price: '', stock_quantity: '' });

  const loadRecords = async () => {
    const res = await fetch(`${API}/records`);
    const data = await res.json();
    setRecords(data);
  };

  useEffect(() => { loadRecords(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API}/records/${editing.record_id}` : `${API}/records`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    loadRecords();
    setShowForm(false);
    setEditing(null);
    setForm({ label_number: '', title: '', company_id: '', release_date: '', wholesale_price: '', retail_price: '', stock_quantity: '' });
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить?')) {
      await fetch(`${API}/records/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      loadRecords();
    }
  };



  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление пластинками</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить пластинку
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Редактировать' : 'Новая пластинка'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Название"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Ансамбль"
                value={formData.ensemble}
                onChange={(e) => setFormData({ ...formData, ensemble: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Розничная цена"
                value={formData.retail_price}
                onChange={(e) => setFormData({ ...formData, retail_price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Оптовая цена"
                value={formData.wholesale_price}
                onChange={(e) => setFormData({ ...formData, wholesale_price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Количество на складе"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
              <div>
                <label className="block text-sm text-gray-600 mb-1">Обложка альбома</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
                )}
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
                  {editing ? 'Сохранить' : 'Добавить'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {record.image ? (
                <img src={record.image} alt={record.title} className="w-full h-full object-cover" />
              ) : (
                <Music className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{record.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{record.ensemble}</p>
              <p className="text-blue-600 font-semibold mb-2">{record.retail_price} ₽</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(record)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded text-sm flex items-center justify-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Изменить
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded text-sm flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
