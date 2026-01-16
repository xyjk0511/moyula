import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { useMoyuu } from '../contexts/MoyuuContext';
import { useNavigate } from 'react-router-dom';

const Stats = () => {
    const { records, isLoading } = useMoyuu();
    const navigate = useNavigate();

    // ... (logic remains same)

    const handleViewRecord = (record: any) => {
        navigate('/receipt', { state: { record } });
    };

    const handleViewAll = () => {
        navigate('/all-records');
    };

    // Process data for the chart (last 7 days or matching days of week)
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const chartData = weekdays.map(day => {
        const dayRecords = records.filter(r => {
            const date = new Date(r.date);
            return weekdays[date.getDay()] === day;
        });
        const totalEarnings = dayRecords.reduce((sum, r) => sum + r.earnings, 0);
        return { day, value: totalEarnings };
    });

    // Calculate weekly summary
    const totalWeeklyEarnings = chartData.reduce((sum, d) => sum + d.value, 0);
    const totalWeeklyDurationSeconds = records.reduce((sum, r) => {
        // Basic duration parsing "Xm Ys" -> seconds
        const match = r.duration.match(/(\d+)m\s*(\d*)s*/);
        if (match) {
            const m = parseInt(match[1]) || 0;
            const s = parseInt(match[2]) || 0;
            return sum + m * 60 + s;
        }
        return sum;
    }, 0);

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar pt-4 px-6 gap-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-30 py-2 bg-creamy-bg/80 backdrop-blur-md">
                <h2 className="text-text-main text-lg font-bold tracking-tight">摸鱼统计</h2>
                <div className="size-10"></div>
            </div>

            {/* Main Chart Card */}
            <div className="glass-card rounded-[2rem] p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                        <p className="text-text-sub text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-60">本周摸鱼分布</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-text-main text-3xl font-black">{formatDuration(totalWeeklyDurationSeconds)}</span>
                            <span className="text-primary text-[10px] font-black bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">实时</span>
                        </div>
                    </div>
                    <div className="size-8 rounded-xl bg-creamy-accent flex items-center justify-center">
                        <span className="material-symbols-outlined text-text-sub text-lg">calendar_month</span>
                    </div>
                </div>

                <div className="h-48 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.value > 0 ? 'var(--color-primary)' : 'rgba(240, 196, 66, 0.05)'}
                                        className="transition-all duration-500"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between mt-4 px-1">
                    {chartData.map((d, i) => (
                        <span key={i} className={`text-[10px] font-black tracking-tighter ${d.value > 0 ? 'text-primary' : 'text-text-sub opacity-40'}`}>{d.day}</span>
                    ))}
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-3xl p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-4xl">schedule</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-lg">timer</span>
                        </div>
                        <p className="text-text-sub text-[10px] font-black uppercase tracking-widest">本周时长</p>
                    </div>
                    <p className="text-text-main text-2xl font-black">{formatDuration(totalWeeklyDurationSeconds)}</p>
                </div>
                <div className="glass-card rounded-3xl p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-4xl">account_balance_wallet</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-green-500/10 p-1.5 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-500 text-lg">savings</span>
                        </div>
                        <p className="text-text-sub text-[10px] font-black uppercase tracking-widest">本周收获</p>
                    </div>
                    <p className="text-text-main text-2xl font-black">¥{totalWeeklyEarnings.toFixed(2)}</p>
                </div>
            </div>

            {/* Recent Records */}
            <div className="flex flex-col gap-6 mt-2">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-text-main text-xl font-black tracking-tight">最近记录</h3>
                    <button
                        onClick={handleViewAll}
                        className="flex items-center gap-1 text-primary text-[11px] font-black uppercase tracking-widest py-1 px-3 bg-primary/10 rounded-full border border-primary/20 hover:bg-primary/20 transition-all"
                    >
                        <span>全部</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {records.slice(0, 10).length > 0 ? (
                        records.slice(0, 10).map((record, i) => (
                            <div
                                key={record.id}
                                onClick={() => handleViewRecord(record)}
                                className="glass-card rounded-[2rem] p-5 flex items-center justify-between active:scale-[0.98] group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`size-14 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden`}>
                                        <div className={`absolute inset-0 ${record.activityColor || 'bg-primary/20'} opacity-20`}></div>
                                        {record.mood ? (
                                            <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform">{record.mood}</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-primary fill-icon text-2xl relative z-10">{record.activityIcon || 'coffee'}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-text-main font-black text-sm">{record.displayDate}</p>
                                        <div className="flex items-center gap-1.5 opacity-60">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            <p className="text-text-sub text-[10px] font-bold uppercase tracking-widest">{record.duration}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-primary font-black text-lg leading-tight">¥{record.earnings.toFixed(2)}</p>
                                    <p className="text-[9px] font-black text-text-sub uppercase tracking-widest mt-0.5 opacity-40">已赚取</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 opacity-50">
                            <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                            <p className="text-xs">暂无记录，快去摸鱼吧！</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Stats;