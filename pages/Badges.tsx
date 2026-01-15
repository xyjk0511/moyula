import React from 'react';
import { useMoyuu } from '../contexts/MoyuuContext';

const Badges = () => {
    const { badges, records, isLoading } = useMoyuu();

    const totalEarnings = records.reduce((sum, r) => sum + r.earnings, 0);
    const unlockedBadges = badges.filter(b => b.unlocked);
    const lockedBadges = badges.filter(b => !b.unlocked);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar pt-4 gap-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-30 py-2 px-6 bg-creamy-bg/80 backdrop-blur-md">
                <h2 className="text-text-main text-lg font-bold tracking-tight">摸鱼勋章</h2>
                <div className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm">
                    <span className="material-symbols-outlined text-text-main">share</span>
                </div>
            </div>

            {/* Hero Badge */}
            <div className="flex flex-col items-center text-center px-6">
                <div className="relative mb-8">
                    <div className="size-32 rounded-full bg-primary/15 flex items-center justify-center relative z-10 border-4 border-white dark:border-white/10 shadow-glow">
                        <span className="material-symbols-outlined text-primary text-6xl fill-icon">military_tech</span>
                    </div>
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 -z-0 animate-pulse"></div>
                </div>
                <h2 className="text-3xl font-black text-text-main mb-3 tracking-tight">摸鱼大师</h2>
                <div className="px-5 py-2 glass-card rounded-full border-none bg-primary/10">
                    <p className="text-primary-dark text-xs font-black uppercase tracking-widest">
                        累计赚取 <span className="text-sm">¥{totalEarnings.toFixed(2)}</span>
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="px-6">
                <div className="glass-card rounded-3xl p-6 flex flex-col items-center">
                    <p className="text-text-main text-3xl font-black">{unlockedBadges.length}</p>
                    <p className="text-text-sub text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">已获勋章</p>
                </div>
            </div>

            {/* Unlocked Section */}
            {unlockedBadges.length > 0 && (
                <div className="px-6 mt-2">
                    <h3 className="text-text-main text-xl font-black flex items-center gap-2 mb-6 tracking-tight">
                        已解锁
                        <span className="text-[10px] bg-primary/20 text-primary-dark px-2 py-0.5 rounded-md font-black tracking-widest">{unlockedBadges.length}</span>
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        {unlockedBadges.map((badge, i) => (
                            <div key={badge.id} className="glass-card flex flex-col gap-4 p-5 rounded-[2.5rem] active:scale-95 group transition-all">
                                <div className={`relative w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center`}>
                                    <div className={`absolute inset-0 ${badge.color || 'bg-blue-500'} opacity-10`}></div>
                                    <div className="glass-card p-3.5 rounded-2xl shadow-sm z-10 border-white/50 dark:border-white/10">
                                        <span className={`material-symbols-outlined ${badge.color || 'text-blue-400'} text-4xl group-hover:scale-110 transition-transform`}>{badge.icon}</span>
                                    </div>
                                    {badge.isNew && <div className="absolute top-2 right-2 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-glow">NEW</div>}
                                </div>
                                <div className="px-1 text-center">
                                    <p className="text-text-main text-sm font-black leading-tight tracking-tight">{badge.name}</p>
                                    <p className="text-text-sub text-[9px] mt-1.5 font-bold uppercase tracking-widest opacity-60">2024年达成</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Locked List */}
            <div className="px-6 flex flex-col gap-6">
                <h3 className="text-text-main text-xl font-black mt-4 tracking-tight">未解锁</h3>

                {lockedBadges.length > 0 ? (
                    lockedBadges.map((item, i) => (
                        <div key={item.id} className="glass-card flex items-center gap-5 p-5 rounded-[2rem] opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                            <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center shadow-inner relative overflow-hidden">
                                <span className="material-symbols-outlined text-text-sub text-3xl opacity-60">{item.icon}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-text-main font-black text-base">{item.name}</p>
                                <p className="text-text-sub text-[11px] font-bold opacity-70 mt-0.5">{item.description}</p>
                            </div>
                            <span className="material-symbols-outlined text-text-sub opacity-30">lock</span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 glass-card rounded-[2rem]">
                        <p className="text-text-sub text-[11px] font-black uppercase tracking-widest">恭喜！你已解锁所有勋章 🏆</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Badges;