import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-8 pt-3 px-8 z-50 flex justify-between items-center text-text-sub">
      
      <button 
        onClick={() => navigate('/')}
        className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-primary' : 'hover:text-text-main'}`}
      >
        <span className={`material-symbols-outlined text-[26px] ${isActive('/') ? 'fill-icon' : ''}`}>dashboard</span>
        <span className="text-[10px] font-bold">首页</span>
      </button>

      <button 
        onClick={() => navigate('/stats')}
        className={`flex flex-col items-center gap-1 transition-colors ${isActive('/stats') ? 'text-primary' : 'hover:text-text-main'}`}
      >
        <span className={`material-symbols-outlined text-[26px] ${isActive('/stats') ? 'fill-icon' : ''}`}>leaderboard</span>
        <span className="text-[10px] font-bold">统计</span>
      </button>

      <button 
        onClick={() => navigate('/badges')}
        className={`flex flex-col items-center gap-1 transition-colors ${isActive('/badges') ? 'text-primary' : 'hover:text-text-main'}`}
      >
        <span className={`material-symbols-outlined text-[26px] ${isActive('/badges') ? 'fill-icon' : ''}`}>emoji_events</span>
        <span className="text-[10px] font-bold">勋章</span>
      </button>

      <button 
        onClick={() => navigate('/settings')}
        className={`flex flex-col items-center gap-1 transition-colors ${isActive('/settings') ? 'text-primary' : 'hover:text-text-main'}`}
      >
        <span className={`material-symbols-outlined text-[26px] ${isActive('/settings') ? 'fill-icon' : ''}`}>person</span>
        <span className="text-[10px] font-bold">我的</span>
      </button>

    </div>
  );
};

export default BottomNav;