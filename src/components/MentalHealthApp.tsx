import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import Onboarding from "./Onboarding";
import Dashboard from "./Dashboard";

interface UserProfile {
  name?: string;
  level: number;
  xp: number;
  streak: number;
  currentMood?: string;
  responseStyle: string;
  mentalHealthHistory: string[];
  currentTreatment: string;
  medication: string;
  crisisSupport: string;
}

interface MoodEntry {
  mood: string;
  intensity: number;
  timestamp: Date;
}

interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  aiInsight?: string;
  emotions?: string[];
}

const STORAGE_KEYS = {
  PROFILE: 'mental_health_profile',
  MOOD_HISTORY: 'mood_history',
  JOURNAL_ENTRIES: 'journal_entries'
};

export default function MentalHealthApp() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
        const savedMoods = localStorage.getItem(STORAGE_KEYS.MOOD_HISTORY);
        const savedJournals = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);

        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }

        if (savedMoods) {
          const moods = JSON.parse(savedMoods).map((mood: any) => ({
            ...mood,
            timestamp: new Date(mood.timestamp)
          }));
          setMoodHistory(moods);
        }

        if (savedJournals) {
          const journals = JSON.parse(savedJournals).map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }));
          setJournalEntries(journals);
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        toast({
          title: "Error loading data",
          description: "There was an issue loading your saved data.",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (profile && !isLoading) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    }
  }, [profile, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.MOOD_HISTORY, JSON.stringify(moodHistory));
    }
  }, [moodHistory, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(journalEntries));
    }
  }, [journalEntries, isLoading]);

  const handleOnboardingComplete = (data: any) => {
    const newProfile: UserProfile = {
      level: 1,
      xp: 0,
      streak: 0,
      responseStyle: data.responseStyle,
      mentalHealthHistory: data.mentalHealthHistory,
      currentTreatment: data.currentTreatment,
      medication: data.medication,
      crisisSupport: data.crisisSupport,
    };

    setProfile(newProfile);
    
    toast({
      title: "Welcome to Inner Zen Explorer! 🎉",
      description: "Your personalized mental health journey begins now.",
    });
  };

  const handleMoodSubmit = (entry: MoodEntry) => {
    const newMoods = [...moodHistory, entry];
    setMoodHistory(newMoods);
    
    // Update profile with XP and mood
    if (profile) {
      const newXP = profile.xp + 10;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      setProfile({
        ...profile,
        xp: newXP,
        level: Math.max(profile.level, newLevel),
        currentMood: entry.mood,
        streak: calculateStreak(newMoods)
      });

      if (newLevel > profile.level) {
        toast({
          title: `Level Up! 🎉`,
          description: `You've reached level ${newLevel}! Keep up the great work.`,
        });
      }
    }
  };

  const handleJournalSubmit = (entryData: Omit<JournalEntry, "id" | "timestamp">) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    const newEntries = [...journalEntries, newEntry];
    setJournalEntries(newEntries);
    
    // Update profile with XP
    if (profile) {
      const newXP = profile.xp + 15;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      setProfile({
        ...profile,
        xp: newXP,
        level: Math.max(profile.level, newLevel),
        streak: calculateJournalStreak(newEntries)
      });

      if (newLevel > profile.level) {
        toast({
          title: `Level Up! 🎉`,
          description: `You've reached level ${newLevel}! Your self-reflection is paying off.`,
        });
      }
    }
  };

  const calculateStreak = (moods: MoodEntry[]): number => {
    if (moods.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const hasEntry = moods.some(mood => 
        mood.timestamp.toDateString() === date.toDateString()
      );
      
      if (hasEntry) {
        streak++;
      } else if (streak > 0) {
        break;
      }
    }
    
    return streak;
  };

  const calculateJournalStreak = (entries: JournalEntry[]): number => {
    if (entries.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const hasEntry = entries.some(entry => 
        entry.timestamp.toDateString() === date.toDateString()
      );
      
      if (hasEntry) {
        streak++;
      } else if (streak > 0) {
        break;
      }
    }
    
    return streak;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-calm">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-healing rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-healing">
            <div className="w-8 h-8 bg-white rounded-full animate-breathe"></div>
          </div>
          <p className="text-muted-foreground">Loading your mental health companion...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Dashboard
      profile={profile}
      onMoodSubmit={handleMoodSubmit}
      onJournalSubmit={handleJournalSubmit}
      journalEntries={journalEntries}
      moodHistory={moodHistory}
    />
  );
}