import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MoyuuProvider } from './contexts/MoyuuContext';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Badges from './pages/Badges';
import Settings from './pages/Settings';
import Receipt from './pages/Receipt';
import AllRecords from './pages/AllRecords';
import BottomNav from './components/BottomNav';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  // Don't show bottom nav on Receipt and AllRecords pages
  const showNav = !['/receipt', '/all-records'].includes(location.pathname);

  return (
    <div className="bg-creamy-bg max-w-md mx-auto h-[100dvh] relative shadow-2xl overflow-hidden flex flex-col">
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
      {showNav && <BottomNav />}
    </div>
  );
};

const App = () => {
  return (
    <MoyuuProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/all-records" element={<AllRecords />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/receipt" element={<Receipt />} />
          </Routes>
        </Layout>
      </HashRouter>
    </MoyuuProvider>
  );
};

export default App;