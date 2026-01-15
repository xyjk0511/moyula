import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoyuu } from '../contexts/MoyuuContext';

const AllRecords = () => {
    const { records, isLoading } = useMoyuu();
    const navigate = useNavigate();

    const handleViewRecord = (record: any) => {
        navigate('/receipt', { state: { record } });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-screen bg-creamy-bg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full min-h-screen bg-creamy-bg overflow-y-auto no-scrollbar pt-4 px-6 gap-6 pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 sticky top-0 z-30 py-2 bg-creamy-bg/80 backdrop-blur-md">
                <button
                    onClick={() => navigate(-1)}
                    className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100"
                >
                    <span className="material-symbols-outlined text-text-main">arrow_back</span>
                </button>
                <h2 className="text-text-main text-lg font-bold tracking-tight">全部记录</h2>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                {records.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {records.map((record) => (
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
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 opacity-50 flex flex-col items-center">
                        <span className="material-symbols-outlined text-5xl mb-3">inbox</span>
                        <p className="text-sm">暂无记录</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllRecords;
