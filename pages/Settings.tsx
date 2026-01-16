import React from 'react';
import { useMoyuu } from '../contexts/MoyuuContext';

const Settings = () => {
    const { username, avatarUrl, salaryPerHour, setSalaryPerHour, isDarkMode, toggleDarkMode, signOut, records, updateProfile } = useMoyuu();

    const handleEditName = () => {
        const input = window.prompt("请输入您的职场代号", username);
        if (input !== null && input.trim() !== "") {
            updateProfile({ username: input });
        }
    };

    const handleEditSalary = () => {
        const input = window.prompt("请输入您的时薪 (数字)", salaryPerHour.toString());
        if (input !== null) {
            const num = parseFloat(input);
            if (!isNaN(num) && num > 0) {
                setSalaryPerHour(num);
            }
        }
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar pt-6 px-6 gap-6 pb-24">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-main">个人设置</h1>
                <div className="size-10"></div>
            </header>

            {/* Profile Card */}
            <div className="bg-creamy-card p-6 rounded-[1.5rem] shadow-card border border-white dark:border-white/10 flex items-center gap-4">
                <div className="relative size-16 rounded-full overflow-hidden border-4 border-primary/10 bg-gray-100 flex items-center justify-center">
                    <img src={avatarUrl || "https://picsum.photos/100/100?random=2"} className="w-full h-full object-cover" alt="User" />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-text-main">{username || '摸鱼专员'}</h2>
                    <p className="text-sm text-text-sub">已坚持摸鱼 {records.length + 7} 天</p>
                </div>
                <button onClick={handleEditName} className="material-symbols-outlined text-text-sub p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">edit</button>
            </div>

            {/* Salary Card */}
            <div className="w-full rounded-[1.5rem] bg-creamy-card p-6 border border-white dark:border-white/10 shadow-card">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-text-sub flex items-center gap-1 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[18px] text-primary">analytics</span>
                        我的身价
                    </span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-text-main opacity-60">¥</span>
                    <span className="text-4xl font-black text-text-main tracking-tight">{salaryPerHour.toFixed(2)}</span>
                    <span className="text-sm font-medium text-text-sub ml-1">/ 小时</span>
                </div>
            </div>

            {/* Config Section - Renamed/Restructured */}
            <div className="space-y-3">
                <h3 className="px-2 text-xs font-bold text-text-sub uppercase tracking-widest">基础设置</h3>
                <div className="bg-creamy-card rounded-[1.5rem] border border-white dark:border-white/10 shadow-card overflow-hidden">
                    <div onClick={handleEditSalary} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="size-10 rounded-2xl bg-orange-100 dark:bg-orange-900/50 text-orange-500 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[22px]">edit_square</span>
                        </div>
                        <span className="flex-1 font-medium text-text-main">时薪设置</span>
                        <span className="text-xs text-text-main font-bold">¥ {salaryPerHour}</span>
                        <span className="material-symbols-outlined text-text-sub text-[20px]">chevron_right</span>
                    </div>
                </div>
            </div>

            {/* Other Section */}
            <div className="space-y-3">
                <h3 className="px-2 text-xs font-bold text-text-sub uppercase tracking-widest">其他</h3>
                <div className="bg-creamy-card rounded-[1.5rem] border border-white dark:border-white/10 shadow-card overflow-hidden">
                    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-white/5">
                        <div className="size-10 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-500 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[22px]">dark_mode</span>
                        </div>
                        <span className="flex-1 font-medium text-text-main">黑夜模式</span>
                        <div
                            onClick={toggleDarkMode}
                            className={`w-11 h-6 rounded-full flex items-center transition-colors px-1 cursor-pointer ${isDarkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-white/20'}`}
                        >
                            <div className={`size-4 bg-white rounded-full shadow-sm transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-white/5">
                        <div className="size-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-500 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[22px]">feedback</span>
                        </div>
                        <span className="flex-1 font-medium text-text-main">意见反馈</span>
                        <span className="material-symbols-outlined text-text-sub text-[20px]">chevron_right</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <div className="size-10 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[22px]">info</span>
                        </div>
                        <span className="flex-1 font-medium text-text-main">关于摸鱼办</span>
                        <span className="text-xs text-text-sub font-medium">v2.1.0</span>
                    </div>
                </div>
            </div>
            <button
                onClick={signOut}
                className="w-full mt-2 py-4 text-red-400 font-bold text-sm bg-red-50/50 dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-colors"
            >
                推出摸鱼宇宙
            </button>
        </div>
    );
};

export default Settings;