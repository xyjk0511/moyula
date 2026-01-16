import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import { MoyuuRecord, Badge } from '../types';

interface MoyuuContextType {
  salaryPerHour: number;
  setSalaryPerHour: (amount: number) => void;
  isTimerRunning: boolean;
  elapsedSeconds: number;
  currentEarnings: number;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  username: string;
  avatarUrl: string;
  updateProfile: (data: { username?: string, avatarUrl?: string, salaryPerHour?: number }) => Promise<void>;
  records: MoyuuRecord[];
  badges: Badge[];
  saveRecord: (record: Omit<MoyuuRecord, 'id'>) => Promise<boolean>;
  isLoading: boolean;
  isSaving: boolean;
  user: any;
  signOut: () => Promise<void>;
}

const MoyuuContext = createContext<MoyuuContextType | undefined>(undefined);

export const MoyuuProvider = ({ children }: { children?: ReactNode }) => {
  const [salaryPerHour, setSalaryPerHour] = useState(45.00);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [records, setRecords] = useState<MoyuuRecord[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [accumulatedMs, setAccumulatedMs] = useState(0);

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData(session.user.id);
      } else {
        setRecords([]);
        setBadges([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Session Persistence & Timer Logic
  useEffect(() => {
    const savedSession = localStorage.getItem('moyuu_session');
    if (savedSession) {
      try {
        const { isRunning, start, accumulated } = JSON.parse(savedSession);
        setIsTimerRunning(isRunning);
        setStartTimestamp(start);
        setAccumulatedMs(accumulated);

        if (isRunning && start) {
          const currentElapsed = Math.floor((Date.now() - start + accumulated) / 1000);
          setElapsedSeconds(currentElapsed);
        } else {
          setElapsedSeconds(Math.floor(accumulated / 1000));
        }
      } catch (e) {
        console.error("Failed to parse saved session", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moyuu_session', JSON.stringify({
      isRunning: isTimerRunning,
      start: startTimestamp,
      accumulated: accumulatedMs
    }));
  }, [isTimerRunning, startTimestamp, accumulatedMs]);

  useEffect(() => {
    let interval: number | undefined;

    if (isTimerRunning && startTimestamp !== null) {
      interval = window.setInterval(() => {
        const totalMs = Date.now() - startTimestamp + accumulatedMs;
        setElapsedSeconds(Math.floor(totalMs / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, startTimestamp, accumulatedMs]);

  const fetchData = async (userId: string) => {
    setIsLoading(true);
    try {
      // Fetch Settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (settingsData) {
        setSalaryPerHour(settingsData.salary_per_hour);
        setIsDarkMode(settingsData.is_dark_mode);
        setUsername(settingsData.username || '');
        setAvatarUrl(settingsData.avatar_url || '');
      } else {
        // Initialize default settings for new user
        await supabase.from('settings').insert({
          user_id: userId,
          salary_per_hour: 45.0,
          is_dark_mode: false
        });
      }

      // Fetch Records
      const { data: recordsData } = await supabase
        .from('records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (recordsData) {
        setRecords(recordsData.map(r => ({
          id: r.id,
          date: r.date,
          displayDate: new Date(r.date + 'T00:00:00').toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }),
          timeOfDay: '下午',
          duration: r.duration,
          earnings: r.earnings,
          activityIcon: r.activity_icon,
          activityColor: r.activity_color,
          mood: r.mood
        })));
      }

      // Fetch Badges
      const { data: badgesData } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', userId);

      if (badgesData && badgesData.length > 0) {
        setBadges(badgesData);
      } else {
        // Initialize default badges for new user
        const defaultBadges = [
          { name: '带薪拉屎王', description: '单次摸鱼超过 20 分钟', icon: 'soap', color: 'text-blue-400', user_id: userId },
          { name: '摸鱼全勤奖', description: '连续 7 天记录摸鱼时长', icon: 'verified', color: 'text-orange-400', user_id: userId },
          { name: '太空漫游', description: '累计摸鱼时间达到 10 小时', icon: 'rocket_launch', color: 'text-purple-400', user_id: userId },
          { name: '咖啡因崩溃', description: '单次摸鱼时长超过 2 小时', icon: 'coffee', color: 'text-brown-400', user_id: userId }
        ];
        const { data: newBadges } = await supabase.from('badges').insert(defaultBadges).select();
        if (newBadges) setBadges(newBadges);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate earnings based on salary and elapsed time
  const currentEarnings = (salaryPerHour / 3600) * elapsedSeconds;

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const updateSalary = async (amount: number) => {
    if (!user) return;
    setSalaryPerHour(amount);
    await supabase.from('settings').upsert({
      user_id: user.id,
      salary_per_hour: amount,
      is_dark_mode: isDarkMode,
      username,
      avatar_url: avatarUrl
    });
  };

  const updateProfile = async (data: { username?: string, avatarUrl?: string, salaryPerHour?: number }) => {
    if (!user) return;
    if (data.username !== undefined) setUsername(data.username);
    if (data.avatarUrl !== undefined) setAvatarUrl(data.avatarUrl);
    if (data.salaryPerHour !== undefined) setSalaryPerHour(data.salaryPerHour);

    await supabase.from('settings').upsert({
      user_id: user.id,
      username: data.username !== undefined ? data.username : username,
      avatar_url: data.avatarUrl !== undefined ? data.avatarUrl : avatarUrl,
      salary_per_hour: data.salaryPerHour !== undefined ? data.salaryPerHour : salaryPerHour,
      is_dark_mode: isDarkMode
    });
  };

  const toggleDarkMode = async () => {
    if (!user) return;
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await supabase.from('settings').upsert({ user_id: user.id, salary_per_hour: salaryPerHour, is_dark_mode: newMode });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const startTimer = () => {
    setStartTimestamp(Date.now());
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    if (startTimestamp !== null) {
      setAccumulatedMs(prev => prev + (Date.now() - startTimestamp));
    }
    setStartTimestamp(null);
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setStartTimestamp(null);
    setAccumulatedMs(0);
    setElapsedSeconds(0);
    localStorage.removeItem('moyuu_session');
  };

  const checkBadges = async (newRecord: Omit<MoyuuRecord, 'id'>) => {
    const updatedBadges = [...badges];
    let changed = false;

    // Helper to parse duration "Xm Ys"
    const parseDuration = (d: string) => {
      const match = d.match(/(\d+)m\s*(\d*)s*/);
      return match ? (parseInt(match[1]) || 0) * 60 + (parseInt(match[2]) || 0) : 0;
    };

    const sessionSeconds = parseDuration(newRecord.duration);
    const totalSeconds = records.reduce((sum, r) => sum + parseDuration(r.duration), 0) + sessionSeconds;
    const currentHour = new Date().getHours();

    const unlock = async (name: string) => {
      const badge = updatedBadges.find(b => b.name === name && !b.unlocked);
      if (badge) {
        badge.unlocked = true;
        badge.unlockDate = new Date().toISOString();
        badge.isNew = true;
        changed = true;
        await supabase.from('badges').update({
          unlocked: true,
          unlock_date: badge.unlockDate,
          is_new: true
        }).eq('name', name).eq('user_id', user?.id);
      }
    };

    // 1. 带薪拉屎王: Session > 20m
    if (sessionSeconds > 20 * 60) await unlock('带薪拉屎王');

    // 2. 太空漫游: Total > 10h
    if (totalSeconds > 10 * 3600) await unlock('太空漫游');

    // 3. 咖啡因崩溃: Session > 2h
    if (sessionSeconds > 2 * 3600) await unlock('咖啡因崩溃');

    if (changed) {
      setBadges(updatedBadges);
    }
  };

  const saveRecord = async (newRecord: Omit<MoyuuRecord, 'id'>) => {
    if (!user) return false;
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('records')
        .insert([{
          user_id: user.id,
          date: newRecord.date,
          duration: newRecord.duration,
          earnings: newRecord.earnings,
          activity_icon: newRecord.activityIcon,
          activity_color: newRecord.activityColor,
          mood: newRecord.mood,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const savedRecord: MoyuuRecord = {
          ...newRecord,
          id: data[0].id,
          displayDate: new Date(data[0].date + 'T00:00:00').toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
        };
        setRecords(prev => [savedRecord, ...prev]);

        // After saving record, check for new badges
        await checkBadges(newRecord);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving record:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MoyuuContext.Provider
      value={{
        salaryPerHour,
        setSalaryPerHour: updateSalary,
        isTimerRunning,
        elapsedSeconds,
        currentEarnings,
        startTimer,
        stopTimer,
        resetTimer,
        isDarkMode,
        toggleDarkMode,
        username,
        avatarUrl,
        updateProfile,
        records,
        badges,
        saveRecord,
        isLoading,
        isSaving,
        user,
        signOut
      }}
    >
      {children}
    </MoyuuContext.Provider>
  );
};

export const useMoyuu = () => {
  const context = useContext(MoyuuContext);
  if (context === undefined) {
    throw new Error('useMoyuu must be used within a MoyuuProvider');
  }
  return context;
};