import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Music } from 'lucide-react';

const mockRecords = [
  { id: 1, title: 'Symphony No. 5', ensemble: 'Berlin Philharmonic', retail_price: 1500, wholesale_price: 1000, stock: 50, sold_current: 30, image: null },
  { id: 2, title: 'Jazz Classics', ensemble: 'Miles Davis Quartet', retail_price: 1200, wholesale_price: 800, stock: 35, sold_current: 45, image: null },
];

export default function RecordsAdmin() {
  const { canEdit } = useAuth();
  const [records, setRecords] = useState(mockRecords);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '', ensemble: '', retail_price: '', wholesale_price: '', stock: '', image: null,
  });

  if (!canEdit()) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg">
        <Music className="w-12 h-12 mx-auto mb-2" />
        <p>Доступ запрещен. Только администратор и владелец могут управлять товарами.</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setRecords((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...formData } : r))
      );
    } else {
      setRecords((prev) => [...prev, { ...formData, id: Date.now(), sold_current: 0 }]);
    }
    setShowForm(false);
    setEditing(null);
    setFormData({ title: '', ensemble: '', retail_price: '', wholesale_price: '', stock: '', image: null });
  };

  const handleEdit = (record) => {
    setEditing(record);
    setFormData(record);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
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
