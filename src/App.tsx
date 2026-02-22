import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import MapPage from './pages/MapPage';
import AdminPage from './pages/AdminPage';
import { useBlogStore } from './store/store';
import { FONT } from './lib/constants';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const { loading, initializeData } = useBlogStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#000',
        gap: '20px',
      }}>
        <div style={{ ...FONT, fontSize: '12px', color: 'var(--brand)', letterSpacing: '0.2em' }}
          className="neon-glow">
          LOADING...
        </div>
        <div style={{ width: '200px', height: '4px', backgroundColor: '#111' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #00FF41, #00FFFF)',
            boxShadow: '0 0 8px rgba(0, 255, 65, 0.5)',
            animation: 'xp-fill 1.5s ease-out forwards',
            width: '100%',
          }} />
        </div>
        <p style={{ ...FONT, fontSize: '7px', color: '#444', letterSpacing: '0.15em' }}>
          CONNECTING TO DATABASE_
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "flex-grow" : "flex-grow pt-20"}>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
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
