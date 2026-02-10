export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type Entry = {
  id: number;
  userId: number;
  title: string;
  oneLine: string;
  content: string;
  mood: string;
  someoneWasThere: boolean;
  someoneCareNote: string;
  quietGratitude: string;
  closeTheDay: boolean;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthPayload = {
  token: string;
  user: User;
};

export type MoodAnalytics = {
  periodDays: number;
  totalEntries: number;
  moodCounts: Record<string, number>;
  dominantMood: string;
  currentScore: number;
  previousScore: number;
  trend: "improving" | "stable" | "declining";
};

export type DailyPrompt = {
  date: string;
  prompt: string;
};

export type MemoryLaneItem = {
  id: number;
  title: string;
  oneLine: string;
  mood: string;
  content: string;
  createdAt: string;
};

export type MemoryLaneResponse = {
  message: string;
  items: MemoryLaneItem[];
};

export type StreakAnalytics = {
  currentStreak: number;
  longestStreak: number;
  rewardReady: boolean;
  rewardMessage: string;
};

export type HeatmapDay = {
  date: string;
  level: number;
  count: number;
  hasEntry: boolean;
  hasCare: boolean;
  noGuilt: boolean;
};

export type CareHeatmapResponse = {
  days: HeatmapDay[];
  noGuiltNotice: string;
};

export type OldEntryPeek = {
  id: number;
  title: string;
  oneLine: string;
  mood: string;
  content: string;
  createdAt: string;
};
