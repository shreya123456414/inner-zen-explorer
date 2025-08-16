import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Brain, 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  Award,
  Zap,
  Sun,
  Moon,
  Activity,
  Gamepad2,
  Music,
  MessageCircle,
  BarChart3,
  Phone
} from "lucide-react";
import MoodTracker from "./MoodTracker";
import Journal from "./Journal";
import TherapeuticGames from "./TherapeuticGames";
import MusicTherapy from "./MusicTherapy";
import MentalHealthChatbot from "./MentalHealthChatbot";
import MentalHealthAnalyzer from "./MentalHealthAnalyzer";
import EmergencySupport from "./EmergencySupport";

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

interface DashboardProps {
  profile: UserProfile;
  onMoodSubmit: (entry: MoodEntry) => void;
  onJournalSubmit: (entry: Omit<JournalEntry, "id" | "timestamp">) => void;
  journalEntries: JournalEntry[];
  moodHistory: MoodEntry[];
}

export default function Dashboard({ 
  profile, 
  onMoodSubmit, 
  onJournalSubmit, 
  journalEntries, 
  moodHistory 
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"mood" | "journal" | "insights" | "games" | "music" | "chat" | "analyzer" | "emergency">("mood");
  const [currentTheme, setCurrentTheme] = useState("theme-calm");

  // Update theme based on most recent mood
  useEffect(() => {
    if (moodHistory.length > 0) {
      const recentMood = moodHistory[moodHistory.length - 1].mood;
      const moodThemes: Record<string, string> = {
        happy: "theme-happy",
        sad: "theme-sad",
        anxious: "theme-stressed",
        stressed: "theme-stressed",
        motivated: "theme-motivated",
        calm: "theme-calm",
        peaceful: "theme-calm"
      };
      
      const theme = moodThemes[recentMood] || "theme-calm";
      setCurrentTheme(theme);
      document.body.className = theme;
    }
  }, [moodHistory]);

  const todaysMoods = moodHistory.filter(
    entry => entry.timestamp.toDateString() === new Date().toDateString()
  );

  const averageMoodToday = todaysMoods.length > 0 
    ? todaysMoods.reduce((sum, entry) => sum + entry.intensity, 0) / todaysMoods.length
    : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    const greetings = {
      gentle: {
        morning: "Good morning, beautiful soul 🌸",
        afternoon: "Good afternoon, dear friend 💫", 
        evening: "Good evening, peaceful spirit 🌙"
      },
      motivational: {
        morning: "Rise and shine, champion! 🚀",
        afternoon: "Keep crushing it today! ⚡",
        evening: "You've got this! Finish strong! 💪"
      },
      neutral: {
        morning: "Good morning",
        afternoon: "Good afternoon", 
        evening: "Good evening"
      }
    };

    const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
    const styleGreetings = greetings[profile.responseStyle as keyof typeof greetings] || greetings.neutral;
    
    return styleGreetings[timeOfDay as keyof typeof styleGreetings];
  };

  const achievements = [
    { icon: Zap, label: "First Steps", unlocked: profile.xp > 0, description: "Started your journey" },
    { icon: Heart, label: "Mood Master", unlocked: moodHistory.length >= 7, description: "7 mood entries" },
    { icon: Brain, label: "Thoughtful Writer", unlocked: journalEntries.length >= 3, description: "3 journal entries" },
    { icon: Award, label: "Consistent Tracker", unlocked: profile.streak >= 5, description: "5-day streak" },
  ];

  return (
    <div className="min-h-screen bg-background transition-all duration-500">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-healing bg-clip-text text-transparent">
                Inner Zen Explorer
              </h1>
              <p className="text-muted-foreground">{getGreeting()}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Level</div>
                <div className="text-xl font-bold text-primary">{profile.level}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Streak</div>
                <div className="text-xl font-bold text-healing">{profile.streak}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-1 bg-card/50 p-1 rounded-lg border border-border/50">
              {[
                { id: "mood", label: "Mood", icon: Heart },
                { id: "journal", label: "Journal", icon: Brain },
                { id: "games", label: "Games", icon: Gamepad2 },
                { id: "music", label: "Music", icon: Music },
                { id: "chat", label: "Chat", icon: MessageCircle },
                { id: "analyzer", label: "Analysis", icon: BarChart3 },
                { id: "insights", label: "Insights", icon: Sparkles },
                { id: "emergency", label: "Help", icon: Phone }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-xs">{label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === "mood" && (
                <MoodTracker 
                  onMoodSubmit={onMoodSubmit}
                  currentXP={profile.xp}
                  level={profile.level}
                />
              )}
              
              {activeTab === "journal" && (
                <Journal 
                  onEntrySubmit={onJournalSubmit}
                  entries={journalEntries}
                />
              )}
              
              {activeTab === "games" && <TherapeuticGames />}
              
              {activeTab === "music" && <MusicTherapy />}
              
              {activeTab === "chat" && <MentalHealthChatbot userProfile={profile} />}
              
              {activeTab === "analyzer" && (
                <MentalHealthAnalyzer 
                  moodHistory={moodHistory}
                  journalEntries={journalEntries}
                />
              )}
              
              {activeTab === "emergency" && <EmergencySupport />}
              
              {activeTab === "insights" && (
                <div className="space-y-6">
                  <Card className="glow-soft border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Your Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Today's Average Mood</span>
                            <span>{averageMoodToday.toFixed(1)}/10</span>
                          </div>
                          <Progress value={averageMoodToday * 10} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{moodHistory.length}</div>
                            <div className="text-sm text-muted-foreground">Mood entries</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-healing">{journalEntries.length}</div>
                            <div className="text-sm text-muted-foreground">Journal entries</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <Card className="mood-card border-accent/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 text-white animate-pulse" />
                  <h3 className="font-semibold text-white">Today's Activity</h3>
                </div>
                
                <div className="space-y-3 text-white/80">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mood entries</span>
                    <span className="font-semibold">{todaysMoods.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average mood</span>
                    <span className="font-semibold">{averageMoodToday.toFixed(1)}/10</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Journal entries</span>
                    <span className="font-semibold">
                      {journalEntries.filter(e => 
                        e.timestamp.toDateString() === new Date().toDateString()
                      ).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glow-soft border-healing/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-healing" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, i) => {
                    const Icon = achievement.icon;
                    return (
                      <div 
                        key={i}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                          achievement.unlocked 
                            ? "bg-healing/10 border border-healing/20" 
                            : "opacity-50 grayscale"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${achievement.unlocked ? "text-healing" : "text-muted-foreground"}`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{achievement.label}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        </div>
                        {achievement.unlocked && (
                          <Sparkles className="w-4 h-4 text-healing animate-pulse" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glow-soft border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("mood")}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Log Current Mood
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("games")}
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Play Therapeutic Games
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("music")}
                >
                  <Music className="w-4 h-4 mr-2" />
                  Sound Therapy
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("chat")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}