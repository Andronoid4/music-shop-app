import Bestsellers from './components/Bestsellers';
import RecordForm from './components/RecordForm';
import EnsembleForm from './components/EnsembleForm';
import RecordTable from './components/RecordTable';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🎵 Музыкальный магазин</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Bestsellers />
        <RecordForm onAdded={() => {}} />
      </div>
      <EnsembleForm onAdded={() => {}} />
      <RecordTable />
    </div>
  );
}

export default App;
