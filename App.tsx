import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MoyuuProvider } from './contexts/MoyuuContext';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Badges from './pages/Badges';
import Settings from './pages/Settings';
import Receipt from './pages/Receipt';
import AllRecords from './pages/AllRecords';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import BottomNav from './components/BottomNav';
import { useMoyuu } from './contexts/MoyuuContext';
import { Navigate } from 'react-router-dom';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const { user, username, isLoading } = useMoyuu();

  // Don't show bottom nav on Receipt, AllRecords, Login, and Onboarding pages
  const showNav = !['/receipt', '/all-records', '/login', '/onboarding'].includes(location.pathname);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100dvh] bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">正在激活系统...</p>
        </div>
      </div>
    );
  }

  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  // Redirect to onboarding if profile is incomplete
  if (user && !username && !['/onboarding', '/login'].includes(location.pathname)) {
    return <Navigate to="/onboarding" />;
  }

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
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
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