export interface MoyuuRecord {
  id: string;
  date: string;
  displayDate: string;
  timeOfDay: string;
  duration: string; // e.g. "20m"
  earnings: number;
  activityIcon: string;
  activityColor: string;
  mood?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockDate?: string;
  isNew?: boolean;
}

export enum Tab {
  HOME = 'HOME',
  STATS = 'STATS',
  BADGES = 'BADGES',
  SETTINGS = 'SETTINGS'
}