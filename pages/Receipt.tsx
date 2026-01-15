import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMoyuu } from '../contexts/MoyuuContext';

const Receipt = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentEarnings, resetTimer, elapsedSeconds, saveRecord } = useMoyuu();

    // Check if we are viewing a historical record
    const historicalRecord = location.state?.record;
    const isHistorical = !!historicalRecord;

    const recordData = isHistorical ? historicalRecord : {
        earnings: currentEarnings,
        duration: formatTime(elapsedSeconds),
        date: new Date().toISOString().split('T')[0],
        displayDate: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    const moodEmoji = isHistorical ? (historicalRecord.mood || '😎') : (location.state?.mood || '😎');

    const handleClose = async () => {
        if (isHistorical) {
            navigate(-1);
            return;
        }

        if (elapsedSeconds > 0) {
            await saveRecord({
                date: recordData.date,
                duration: recordData.duration,
                earnings: recordData.earnings,
                displayDate: '', // Handled by context
                timeOfDay: '下午',
                activityIcon: 'coffee',
                activityColor: 'bg-accent-sky/40',
                mood: moodEmoji
            });
        }
        resetTimer();
        navigate('/');
    };

    function formatTime(totalSeconds: number) {
        const m = Math.floor(totalSeconds / 60).toString();
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        return `${m}m ${s}s`;
    }

    return (
        <div className="flex flex-col h-full bg-creamy-bg dark:bg-black transition-colors duration-500 overflow-hidden">
            {/* Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 z-10">
                <button
                    onClick={handleClose}
                    className="size-10 rounded-full glass-card flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined text-text-main">close</span>
                </button>
                <div className="glass-card px-4 py-1.5 rounded-full border-none flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[14px] ${isHistorical ? 'text-blue-500' : 'text-green-500'}`}>
                        {isHistorical ? 'history' : 'verified'}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isHistorical ? 'text-blue-500' : 'text-green-500'}`}>
                        {isHistorical ? '历史记录' : '今日记录'}
                    </span>
                </div>
                <div className="size-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-1 flex flex-col items-center">
                {/* Receipt Container */}
                <div className="w-full max-w-[320px] filter drop-shadow-2xl animate-[slideIn_0.5s_ease-out]">
                    {/* Top Serrated Edge */}
                    <div className="serrated-top h-[15px]"></div>

                    {/* Main Receipt Body */}
                    <div className="bg-white dark:bg-[#1E1E1E] px-8 py-10 flex flex-col items-center relative transition-colors duration-500">
                        {/* Header */}
                        <div className="flex flex-col items-center gap-2 mb-8">
                            <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-1">
                                <span className="material-symbols-outlined text-primary text-4xl fill-icon animate-pulse">receipt_long</span>
                            </div>
                            <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">Moyuu Station</h2>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">官方结算凭证</p>
                        </div>

                        {/* Divider */}
                        <div className="w-full border-b-2 border-dashed border-gray-100 dark:border-white/5 mb-8"></div>

                        {/* Main Stats */}
                        <div className="w-full flex flex-col gap-6 mb-8">
                            <div className="flex justify-between items-baseline">
                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">本次收益</span>
                                <span className="text-3xl font-black text-black dark:text-white tabular-nums tracking-tighter">¥{recordData.earnings.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">摸鱼时长</span>
                                <span className="text-base font-black text-black dark:text-white">{recordData.duration}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">日期</span>
                                <span className="text-sm font-bold text-black dark:text-white opacity-60 font-sans">{recordData.displayDate || recordData.date}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">心情</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{moodEmoji}</span>
                                    <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest opacity-40">已核验</span>
                                </div>
                            </div>
                        </div>

                        {/* QR/Barcode Simulation */}
                        <div className="w-full flex flex-col items-center gap-4 mt-4">
                            <div className="w-full h-8 bg-black dark:bg-white opacity-5 flex gap-1 px-1">
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <div key={i} className="h-full bg-black dark:bg-white transition-opacity" style={{ width: `${Math.random() * 4 + 1}px`, opacity: Math.random() > 0.5 ? 0.8 : 0.2 }}></div>
                                ))}
                            </div>
                            <p className="text-[8px] font-bold text-gray-300 dark:text-gray-600 tracking-[0.5em] uppercase">Moyuu-System-v2.0</p>
                        </div>
                    </div>

                    {/* Bottom Serrated Edge */}
                    <div className="serrated-bottom h-[15px]"></div>
                </div>

                {/* Footer Notes */}
                <div className="mt-8 text-center px-8 opacity-40">
                    <p className="text-[10px] font-bold text-text-sub uppercase tracking-widest leading-relaxed">
                        感谢您为公司节省成本<br />继续摸鱼，明天会更好
                    </p>
                </div>
            </div>

            {/* Bottom Fixed Area */}
            <div className="p-8 glass-card border-none bg-creamy-bg/80 dark:bg-[#050505]/80 backdrop-blur-lg mt-auto">
                <button
                    onClick={handleClose}
                    className="w-full h-12 bg-text-main dark:bg-white text-white dark:text-black rounded-full font-black text-sm uppercase tracking-widest glow-button border-2 border-transparent hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    {isHistorical ? '返回统计' : '保存记录'}
                </button>
            </div>
        </div>
    );
};

export default Receipt;