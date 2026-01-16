import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            navigate('/');
        } catch (err: any) {
            setError(err.message || '登录失败，请检查账号密码');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            setError('注册成功！请查收验证邮件（如果设置了验证）或再次登录');
        } catch (err: any) {
            setError(err.message || '注册失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-screen bg-creamy-bg dark:bg-black transition-colors duration-500 items-center justify-center px-8 relative overflow-hidden">
            {/* Background Decorative Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square bg-primary/10 blur-[100px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square bg-blue-500/5 blur-[100px] rounded-full"></div>

            {/* Logo Section */}
            <div className="flex flex-col items-center gap-4 mb-12 relative animate-[slideIn_0.6s_ease-out]">
                <div className="size-20 bg-primary/20 rounded-3xl flex items-center justify-center shadow-glow border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-5xl fill-icon animate-float">rocket_launch</span>
                </div>
                <div className="text-center">
                    <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase italic">Moyuu Station</h1>
                    <p className="text-[10px] font-black text-text-sub uppercase tracking-[0.4em] opacity-50 mt-1">Professional Slacker HQ</p>
                </div>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-sm glass-card rounded-[2.5rem] p-8 relative z-10 animate-[scaleIn_0.5s_ease-out] border-white/10">
                <h2 className="text-xl font-black text-text-main mb-8 text-center italic">欢迎归位，摸鱼专员</h2>

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-text-sub uppercase tracking-widest pl-4">邮箱地址</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sub text-lg group-focus-within:text-primary transition-colors">mail</span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-2xl py-3.5 pl-11 pr-4 text-text-main placeholder:text-text-sub/30 outline-none transition-all"
                                placeholder="you@company.com"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-text-sub uppercase tracking-widest pl-4">准入密码</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sub text-lg group-focus-within:text-primary transition-colors">lock</span>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-primary/30 rounded-2xl py-3.5 pl-11 pr-4 text-text-main placeholder:text-text-sub/30 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && <p className="text-[10px] font-bold text-red-500 bg-red-500/10 px-4 py-2 rounded-xl text-center animate-[fadeIn_0.3s]">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-primary hover:bg-primary-dark text-text-main font-black text-base rounded-2xl shadow-glow glow-button border-t border-white/20 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : '登录系统'}
                    </button>

                    <div className="flex items-center gap-4 my-2">
                        <div className="flex-1 h-[1px] bg-text-sub/10"></div>
                        <span className="text-[10px] font-black text-text-sub uppercase tracking-widest opacity-30">或</span>
                        <div className="flex-1 h-[1px] bg-text-sub/10"></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSignUp}
                        className="w-full py-3.5 text-[11px] font-black text-text-sub hover:text-text-main transition-colors uppercase tracking-widest border border-text-sub/10 rounded-2xl hover:bg-white/5"
                    >
                        新员注册
                    </button>
                </form>
            </div>

            <div className="mt-12 text-center opacity-30 animate-pulse">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-text-sub">Security Protocol Active</p>
            </div>
        </div>
    );
};

export default Login;
