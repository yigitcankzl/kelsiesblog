import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MapPage from './pages/MapPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Centered content column */}
      <div className="max-w-[1200px] mx-auto bg-background shadow-2xl min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
