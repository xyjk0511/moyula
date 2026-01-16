import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoyuu } from '../contexts/MoyuuContext';

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const [nameInput, setNameInput] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [salaryInput, setSalaryInput] = useState(45);
    const { updateProfile } = useMoyuu();
    const navigate = useNavigate();

    const avatars = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova'
    ];

    const handleFinish = async () => {
        await updateProfile({
            username: nameInput || '摸鱼专员',
            avatarUrl: selectedAvatar || 'https://picsum.photos/100/100?random=1',
            salaryPerHour: salaryInput
        });
        navigate('/');
    };

    return (
        <div className="flex flex-col h-full min-h-screen bg-creamy-bg dark:bg-black items-center justify-center px-8 relative overflow-hidden transition-colors duration-500">
            {/* Background Decor */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] aspect-square bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>

            {/* Progress Indicator */}
            <div className="absolute top-12 flex gap-2 z-20">
                {[1, 2, 3].map(s => (
                    <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-primary shadow-glow' : 'w-4 bg-text-sub/10'}`}></div>
                ))}
            </div>

            <div className="w-full max-w-sm relative z-10 flex flex-col items-center">

                {/* Step 1: Username */}
                {step === 1 && (
                    <div className="w-full flex flex-col items-center gap-8 animate-[slideIn_0.5s_ease-out]">
                        <div className="text-center">
                            <h1 className="text-3xl font-black text-text-main italic mb-2 tracking-tight">你好，摸鱼新人</h1>
                            <p className="text-sm font-bold text-text-sub opacity-60">请问我们该如何称呼你？</p>
                        </div>

                        <div className="w-full flex flex-col gap-4">
                            <input
                                type="text"
                                autoFocus
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="键入你的职场代号..."
                                className="w-full bg-white dark:bg-white/5 border-2 border-transparent focus:border-primary/40 rounded-3xl py-5 px-8 text-xl font-black text-text-main placeholder:text-text-sub/20 shadow-soft outline-none transition-all"
                            />
                            <button
                                onClick={() => setStep(2)}
                                disabled={!nameInput.trim()}
                                className="w-full h-16 bg-primary hover:bg-primary-dark text-text-main font-black text-lg rounded-3xl shadow-glow glow-button uppercase tracking-widest disabled:opacity-30 disabled:shadow-none transition-all mt-4"
                            >
                                下一步
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Avatar */}
                {step === 2 && (
                    <div className="w-full flex flex-col items-center gap-8 animate-[slideIn_0.5s_ease-out]">
                        <div className="text-center">
                            <h1 className="text-3xl font-black text-text-main italic mb-2 tracking-tight">挑选一张面具</h1>
                            <p className="text-sm font-bold text-text-sub opacity-60">在职场中保持你的独特品味</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full">
                            {avatars.map((url, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedAvatar(url)}
                                    className={`aspect-square rounded-[2rem] overflow-hidden border-4 transition-all duration-300 ${selectedAvatar === url ? 'border-primary shadow-glow scale-105' : 'border-transparent bg-white dark:bg-white/5 hover:scale-105 opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        <div className="w-full flex flex-col gap-3 mt-4">
                            <button
                                onClick={() => setStep(3)}
                                className="w-full h-16 bg-primary hover:bg-primary-dark text-text-main font-black text-lg rounded-3xl shadow-glow glow-button uppercase tracking-widest"
                            >
                                {selectedAvatar ? '选好了，下一步' : '先不设头像，跳过'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Salary */}
                {step === 3 && (
                    <div className="w-full flex flex-col items-center gap-8 animate-[slideIn_0.5s_ease-out]">
                        <div className="text-center">
                            <h1 className="text-3xl font-black text-text-main italic mb-2 tracking-tight">最后的核验</h1>
                            <p className="text-sm font-bold text-text-sub opacity-60">你的每小时“带薪成本”是多少？</p>
                        </div>

                        <div className="w-full flex flex-col items-center gap-6">
                            <div className="relative w-full flex flex-col items-center">
                                <div className="text-6xl font-black text-primary mb-2 flex items-baseline">
                                    <span className="text-2xl mr-2 opacity-50 font-bold">¥</span>
                                    {salaryInput}
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="1000"
                                    step="5"
                                    value={salaryInput}
                                    onChange={(e) => setSalaryInput(parseInt(e.target.value))}
                                    className="w-full h-2 bg-text-sub/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between w-full mt-4 px-2 opacity-30 text-[10px] font-black uppercase tracking-widest text-text-sub">
                                    <span>普通打工</span>
                                    <span>财富自由</span>
                                </div>
                            </div>

                            <button
                                onClick={handleFinish}
                                className="w-full h-16 bg-primary hover:bg-primary-dark text-text-main font-black text-lg rounded-3xl shadow-glow glow-button uppercase tracking-widest mt-8"
                            >
                                进入工作岗位
                            </button>
                            <button onClick={() => setStep(2)} className="text-[10px] font-black text-text-sub uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">返回上一步</button>
                        </div>
                    </div>
                )}

            </div>

            <div className="absolute bottom-12 text-center opacity-20">
                <p className="text-[9px] font-black uppercase tracking-[0.8em] text-text-sub italic">Initiating Protocol • 2026</p>
            </div>
        </div>
    );
};

export default Onboarding;
