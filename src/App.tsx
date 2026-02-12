import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MapPage from './pages/MapPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-full">
        <Navbar />
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
