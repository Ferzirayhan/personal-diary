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
  content: string;
  mood: string;
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
  mood: string;
  content: string;
  createdAt: string;
};
