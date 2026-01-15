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
  records: MoyuuRecord[];
  badges: Badge[];
  saveRecord: (record: Omit<MoyuuRecord, 'id'>) => Promise<void>;
  isLoading: boolean;
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

  // Calculate earnings based on salary and elapsed time
  const currentEarnings = (salaryPerHour / 3600) * elapsedSeconds;

  // Initialize data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Settings
        const { data: settingsData } = await supabase
          .from('settings')
          .select('*')
          .single();

        if (settingsData) {
          setSalaryPerHour(settingsData.salary_per_hour);
          setIsDarkMode(settingsData.is_dark_mode);
        }

        // Fetch Records
        const { data: recordsData } = await supabase
          .from('records')
          .select('*')
          .order('created_at', { ascending: false });

        if (recordsData) {
          setRecords(recordsData.map(r => ({
            id: r.id,
            date: r.date,
            displayDate: new Date(r.date + 'T00:00:00').toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }),
            timeOfDay: '下午', // Simplified for now
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
          .select('*');

        if (badgesData) {
          setBadges(badgesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let interval: number | undefined;

    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const updateSalary = async (amount: number) => {
    setSalaryPerHour(amount);
    await supabase.from('settings').upsert({ id: 'default', salary_per_hour: amount, is_dark_mode: isDarkMode });
  };

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await supabase.from('settings').upsert({ id: 'default', salary_per_hour: salaryPerHour, is_dark_mode: newMode });
  };

  const startTimer = () => setIsTimerRunning(true);
  const stopTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setElapsedSeconds(0);
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
        }).eq('name', name);
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
    try {
      console.log('Attempting to save record:', newRecord);
      const { data, error } = await supabase
        .from('records')
        .insert([{
          date: newRecord.date,
          duration: newRecord.duration,
          earnings: newRecord.earnings,
          activity_icon: newRecord.activityIcon,
          activity_color: newRecord.activityColor,
          mood: newRecord.mood,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Supabase save error:', error.message, error.details);
        return;
      }

      console.log('Supabase save success:', data);

      if (data && data[0]) {
        const savedRecord: MoyuuRecord = {
          ...newRecord,
          id: data[0].id,
          displayDate: new Date(data[0].date + 'T00:00:00').toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
        };
        setRecords(prev => [savedRecord, ...prev]);

        // After saving record, check for new badges
        await checkBadges(newRecord);
      }
    } catch (error) {
      console.error('Unhandled error saving record:', error);
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
        records,
        badges,
        saveRecord,
        isLoading
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