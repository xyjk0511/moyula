import React, { useState } from 'react';
import { useMoyuu } from '../contexts/MoyuuContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { isTimerRunning, startTimer, stopTimer, elapsedSeconds, currentEarnings, records, badges } = useMoyuu();
  const navigate = useNavigate();

  // Format seconds into HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  };

  const time = formatTime(elapsedSeconds);

  // Stop timer but stay on page (Resume Work)
  const handleResumeWork = () => {
    stopTimer();
  };

  const [showMoodPicker, setShowMoodPicker] = useState(false);

  // End session completely and show receipt (Get Off Work)
  const handleClockOut = () => {
    // If timer is running, stop it first
    if (isTimerRunning) {
      stopTimer();
    }
    setShowMoodPicker(true);
  };

  const selectMood = (mood: string) => {
    setShowMoodPicker(false);
    navigate('/receipt', { state: { mood } });
  };

  const moods = [
    { emoji: '😎', label: '心情不错' },
    { emoji: '😴', label: '想睡觉' },
    { emoji: '☕', label: '续命成功' },
    { emoji: '📉', label: '想下班' },
    { emoji: '💩', label: '拉屎成功' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar pt-4 px-6 gap-6 pb-32">
      {/* Header */}
      <header className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-11 rounded-full bg-gray-200 ring-4 ring-creamy-accent dark:ring-white/5 shadow-sm overflow-hidden">
              <img src="https://picsum.photos/100/100?random=1" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-green-400 border-2 border-white dark:border-[#1E1E1E] rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-sub uppercase tracking-widest">摸鱼状态</span>
            <h2 className="text-base font-bold text-text-main">摸鱼专员 #007</h2>
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center justify-center size-11 rounded-full bg-creamy-card shadow-card border border-gray-100 dark:border-white/10 hover:bg-creamy-accent dark:hover:bg-white/5 transition-all">
          <span className="material-symbols-outlined text-[22px] text-text-sub">settings</span>
        </button>
      </header>

      {/* Daily Card */}
      <div className="w-full rounded-[2rem] overflow-hidden shadow-soft bg-creamy-card border border-white dark:border-white/5 relative group shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
        <img src="https://picsum.photos/600/300?grayscale" alt="Landscape" className="w-full h-36 object-cover transition-transform duration-1000 group-hover:scale-110" />

        <div className="absolute top-4 left-4 z-20">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            <span className="material-symbols-outlined text-[12px] text-white">event_note</span>
            <span className="text-[9px] font-bold text-white tracking-widest uppercase">今日黄历</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white z-20">
          <h3 className="text-lg font-black mb-0.5 flex items-center gap-2">宜：带薪发呆 <span className="text-xl animate-bounce">☁️</span></h3>
          <p className="text-[9px] font-bold text-white/60 tracking-wide uppercase">忌：打开 Excel 📉</p>
        </div>
      </div>

      {/* Timer Section */}
      <div className="flex flex-col items-center gap-4 mt-2">
        <span className="text-[10px] font-bold text-text-sub uppercase tracking-[0.2em]">已累计摸鱼</span>
        <div className="flex items-center justify-center gap-3">
          {[time.h, time.m, time.s].map((val, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col gap-2 items-center">
                <div className="flex size-16 items-center justify-center rounded-2xl glass-card relative overflow-hidden">
                  {idx === 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary/10 dark:bg-primary/20 transition-all duration-1000" style={{ height: `${(parseInt(time.m) / 60) * 100}%` }}></div>
                  )}
                  <span className="text-2xl font-black tabular-nums text-text-main relative z-10 drop-shadow-sm">{val}</span>
                </div>
                <span className="text-[9px] font-black text-text-sub tracking-widest uppercase">{idx === 0 ? '时' : idx === 1 ? '分' : '秒'}</span>
              </div>
              {idx < 2 && <span className="text-xl font-bold text-primary/40 mb-7 animate-pulse">:</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Earnings Big Display */}
      <div className="flex flex-col items-center justify-center py-6 relative">
        {/* Animated Orbs for Dark Mode */}
        {isTimerRunning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden blur-3xl opacity-30 dark:opacity-40">
            <div className="w-64 h-64 rounded-full bg-primary/20 animate-pulse"></div>
            <div className="absolute w-48 h-48 rounded-full bg-blue-500/10 translate-x-20 -translate-y-10 animate-float"></div>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 ${isTimerRunning ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'} rounded-full mb-4 glass-card border-none`}>
            <span className={`material-symbols-outlined text-[16px] ${isTimerRunning ? 'animate-spin-slow' : ''}`}>savings</span>
            <span className="text-[11px] font-black tracking-wider">{isTimerRunning ? '摸鱼中...' : '本次收益'}</span>
          </div>

          <div className="relative mb-6">
            <h1 className={`${isTimerRunning ? 'text-7xl' : 'text-6xl'} font-black text-text-main transition-all duration-500 tracking-tight tabular-nums flex items-baseline justify-center`}>
              <span className="text-2xl font-bold opacity-30 mr-1.5">¥</span>
              {currentEarnings.toFixed(2)}
            </h1>
            {isTimerRunning && <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full -z-10 animate-pulse"></div>}
          </div>

          <div className="glass-card px-6 py-3.5 rounded-full flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary shadow-glow">
              <span className="material-symbols-outlined text-[18px] text-white fill-icon">coffee</span>
            </div>
            <p className="text-xs font-bold text-text-main">
              相当于 <span className="text-sm font-black text-primary-dark">{Math.max(0.1, currentEarnings / 30).toFixed(1)}</span> 杯生椰拿铁 ☕️
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 w-full mb-48">
        <div className="glass-card p-5 rounded-3xl flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1 opacity-80">
            <div className="p-1.5 bg-green-500/10 rounded-lg">
              <span className="material-symbols-outlined text-[18px] text-green-500">payments</span>
            </div>
            <span className="text-[10px] font-black text-text-sub tracking-widest uppercase">累计收益</span>
          </div>
          <span className="text-xl font-black text-text-main">¥ {records.reduce((sum, r) => sum + r.earnings, 0).toFixed(2)}</span>
        </div>
        <div className="glass-card p-5 rounded-3xl flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1 opacity-80">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <span className="material-symbols-outlined text-[18px] text-blue-400 font-bold">military_tech</span>
            </div>
            <span className="text-[10px] font-black text-text-sub tracking-widest uppercase">已获勋章</span>
          </div>
          <span className="text-xl font-black text-text-main">{badges.filter(b => b.unlocked).length}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-32 left-0 right-0 z-30 flex flex-col items-center gap-3 pointer-events-none">
        {!isTimerRunning ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <button
              onClick={startTimer}
              className="pointer-events-auto w-44 h-12 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center gap-2 glow-button text-text-main border-2 border-white/20"
            >
              <span className="material-symbols-outlined text-[24px]">play_circle</span>
              <span className="text-sm font-black tracking-wider uppercase">开始摸鱼</span>
            </button>

            {/* Show 'Off Work' button if we have recorded some time even if paused */}
            {elapsedSeconds > 0 && (
              <button
                onClick={handleClockOut}
                className="pointer-events-auto flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md text-text-main text-[11px] font-black tracking-widest uppercase border border-white/20 hover:bg-white/60 dark:hover:bg-white/20 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                下班啦
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 w-full">
            <button
              onClick={handleResumeWork}
              className="pointer-events-auto w-44 h-12 bg-text-main dark:bg-white dark:text-black rounded-full flex items-center justify-center gap-2 shadow-xl border-2 border-transparent hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">pause_circle</span>
              <span className="text-sm font-black tracking-wider uppercase">继续工作</span>
            </button>

            <button
              onClick={handleClockOut}
              className="pointer-events-auto flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md text-text-main text-[11px] font-black tracking-widest uppercase border border-white/20 hover:bg-white/60 dark:hover:bg-white/20 transition-all animate-[fadeIn_0.5s]"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              下班啦
            </button>
          </div>
        )}
      </div>

      {/* Mood Picker Modal */}
      {showMoodPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s]">
          <div className="glass-card w-full max-w-xs rounded-[2.5rem] p-8 flex flex-col items-center gap-8 animate-[scaleIn_0.3s]">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="size-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-primary text-2xl fill-icon">sentiment_satisfied</span>
              </div>
              <h3 className="text-xl font-black text-text-main">这次摸鱼感觉如何？</h3>
              <p className="text-[10px] font-bold text-text-sub uppercase tracking-widest">请选择你的心情徽章</p>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full px-2">
              {moods.map((m) => (
                <button
                  key={m.emoji}
                  onClick={() => selectMood(m.emoji)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 dark:bg-white/5 hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all group"
                >
                  <span className="text-3xl transition-transform group-hover:scale-110">{m.emoji}</span>
                  <span className="text-[9px] font-black text-text-sub uppercase tracking-tighter">{m.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => selectMood('')}
              className="text-[11px] font-black text-text-sub hover:text-text-main uppercase tracking-widest px-6 py-2 transition-colors"
            >
              跳过不选
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;