import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('records')
  const [records, setRecords] = useState([])
  const [ensembles, setEnsembles] = useState([])
  const [topSellers, setTopSellers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const [newEnsemble, setNewEnsemble] = useState({
    name: '',
    type: '',
    founded_year: '',
    leader_id: ''
  })

  const [newRecord, setNewRecord] = useState({
    label_number: '',
    title: '',
    company_id: '',
    release_date: '',
    wholesale_price: '',
    retail_price: '',
    stock_quantity: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setRecords([
        { id: 1, label_number: 'EMI-001', title: 'Лучшие произведения классики', retail_price: 750.00, sold_current_year: 200, stock_quantity: 50 },
        { id: 2, label_number: 'MEL-002', title: 'Джазовые вечера', retail_price: 600.00, sold_current_year: 350, stock_quantity: 30 }
      ])
      setEnsembles([
        { id: 1, name: 'Московский камерный оркестр', type: 'оркестр' },
        { id: 2, name: 'Джаз-квартет', type: 'квартет' }
      ])
      setTopSellers([
        { title: 'Джазовые вечера', sold_count: 350 },
        { title: 'Лучшие произведения классики', sold_count: 200 }
      ])
      setError(null)
    } catch (err) {
      setError('Ошибка загрузки данных: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEnsemble = async (e) => {
    e.preventDefault()
    try {
      setMessage('Ансамбль "' + newEnsemble.name + '" успешно добавлен!')
      setNewEnsemble({ name: '', type: '', founded_year: '', leader_id: '' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setError('Ошибка добавления ансамбля: ' + err.message)
    }
  }

  const handleAddRecord = async (e) => {
    e.preventDefault()
    try {
      setMessage('Пластинка "' + newRecord.title + '" успешно добавлена!')
      setNewRecord({ 
        label_number: '', title: '', company_id: '', release_date: '', 
        wholesale_price: '', retail_price: '', stock_quantity: '' 
      })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setError('Ошибка добавления пластинки: ' + err.message)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎵 Музыкальный магазин</h1>
        <p>База данных музыкального магазина</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <nav className="tabs">
        <button 
          className={activeTab === 'records' ? 'active' : ''} 
          onClick={() => setActiveTab('records')}
        >
          Пластинки
        </button>
        <button 
          className={activeTab === 'ensembles' ? 'active' : ''} 
          onClick={() => setActiveTab('ensembles')}
        >
          Ансамбли
        </button>
        <button 
          className={activeTab === 'top' ? 'active' : ''} 
          onClick={() => setActiveTab('top')}
        >
          Лидеры продаж
        </button>
      </nav>

      <main className="content">
        {loading && <div className="loading">Загрузка...</div>}

        {activeTab === 'records' && (
          <div className="section">
            <h2>📀 Пластинки</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Номер наклейки</th>
                  <th>Название</th>
                  <th>Цена (розница)</th>
                  <th>Продано в этом году</th>
                  <th>Остаток</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id}>
                    <td>{record.label_number}</td>
                    <td>{record.title}</td>
                    <td>{record.retail_price} ₽</td>
                    <td>{record.sold_current_year}</td>
                    <td>{record.stock_quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="form-section">
              <h3>Добавить новую пластинку</h3>
              <form onSubmit={handleAddRecord} className="form">
                <input
                  type="text"
                  placeholder="Номер наклейки"
                  value={newRecord.label_number}
                  onChange={(e) => setNewRecord({...newRecord, label_number: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Название"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="ID компании"
                  value={newRecord.company_id}
                  onChange={(e) => setNewRecord({...newRecord, company_id: e.target.value})}
                />
                <input
                  type="date"
                  placeholder="Дата выпуска"
                  value={newRecord.release_date}
                  onChange={(e) => setNewRecord({...newRecord, release_date: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Оптовая цена"
                  value={newRecord.wholesale_price}
                  onChange={(e) => setNewRecord({...newRecord, wholesale_price: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Розничная цена"
                  value={newRecord.retail_price}
                  onChange={(e) => setNewRecord({...newRecord, retail_price: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Количество"
                  value={newRecord.stock_quantity}
                  onChange={(e) => setNewRecord({...newRecord, stock_quantity: e.target.value})}
                />
                <button type="submit" className="btn">Добавить</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'ensembles' && (
          <div className="section">
            <h2>🎻 Ансамбли</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Тип</th>
                </tr>
              </thead>
              <tbody>
                {ensembles.map(ensemble => (
                  <tr key={ensemble.id}>
                    <td>{ensemble.id}</td>
                    <td>{ensemble.name}</td>
                    <td>{ensemble.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="form-section">
              <h3>Добавить новый ансамбль</h3>
              <form onSubmit={handleAddEnsemble} className="form">
                <input
                  type="text"
                  placeholder="Название ансамбля"
                  value={newEnsemble.name}
                  onChange={(e) => setNewEnsemble({...newEnsemble, name: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Тип (оркестр, квартет и т.д.)"
                  value={newEnsemble.type}
                  onChange={(e) => setNewEnsemble({...newEnsemble, type: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Год основания"
                  value={newEnsemble.founded_year}
                  onChange={(e) => setNewEnsemble({...newEnsemble, founded_year: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="ID руководителя"
                  value={newEnsemble.leader_id}
                  onChange={(e) => setNewEnsemble({...newEnsemble, leader_id: e.target.value})}
                />
                <button type="submit" className="btn">Добавить</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'top' && (
          <div className="section">
            <h2>🏆 Лидеры продаж текущего года</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Место</th>
                  <th>Название пластинки</th>
                  <th>Продано экземпляров</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((seller, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{seller.title}</td>
                    <td>{seller.sold_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Курсовой проект | База данных музыкального магазина</p>
      </footer>
    </div>
  )
}

export default App
