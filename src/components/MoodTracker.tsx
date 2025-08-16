import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Smile, Frown, Meh, Heart, Brain, Zap, Sun, Cloud } from "lucide-react";

interface MoodEntry {
  mood: string;
  intensity: number;
  timestamp: Date;
  note?: string;
}

interface MoodTrackerProps {
  onMoodSubmit: (entry: MoodEntry) => void;
  currentXP: number;
  level: number;
}

const moods = [
  { id: "happy", label: "Happy", icon: Smile, color: "text-yellow-500", theme: "theme-happy" },
  { id: "calm", label: "Calm", icon: Heart, color: "text-blue-500", theme: "theme-calm" },
  { id: "anxious", label: "Anxious", icon: Zap, color: "text-orange-500", theme: "theme-stressed" },
  { id: "sad", label: "Sad", icon: Frown, color: "text-purple-500", theme: "theme-sad" },
  { id: "motivated", label: "Motivated", icon: Sun, color: "text-green-500", theme: "theme-motivated" },
  { id: "neutral", label: "Neutral", icon: Meh, color: "text-gray-500", theme: "" },
  { id: "stressed", label: "Stressed", icon: Cloud, color: "text-red-500", theme: "theme-stressed" },
  { id: "peaceful", label: "Peaceful", icon: Brain, color: "text-teal-500", theme: "theme-calm" },
];

export default function MoodTracker({ onMoodSubmit, currentXP, level }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [intensity, setIntensity] = useState(5);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = () => {
    if (!selectedMood) return;
    
    const entry: MoodEntry = {
      mood: selectedMood,
      intensity,
      timestamp: new Date(),
    };
    
    onMoodSubmit(entry);
    setShowThankYou(true);
    
    setTimeout(() => {
      setShowThankYou(false);
      setSelectedMood("");
      setIntensity(5);
    }, 2000);
  };

  const selectedMoodData = moods.find(m => m.id === selectedMood);
  const xpToNextLevel = 100;
  const xpProgress = (currentXP % xpToNextLevel);

  if (showThankYou) {
    return (
      <Card className="w-full max-w-md mx-auto glow-healing animate-pulse-healing border-healing/30">
        <CardContent className="text-center py-8">
          <Heart className="mx-auto w-16 h-16 text-healing mb-4 animate-breathe" />
          <h3 className="text-2xl font-bold text-healing mb-2">Thank you!</h3>
          <p className="text-muted-foreground">Your mood has been recorded</p>
          <div className="mt-4 text-sm text-healing">+10 XP earned</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* XP Progress */}
      <Card className="glow-soft border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Healing Level {level}</CardTitle>
            <div className="text-sm text-muted-foreground">{xpProgress}/{xpToNextLevel} XP</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="xp-bar">
            <div 
              className="xp-progress transition-all duration-500" 
              style={{ width: `${(xpProgress / xpToNextLevel) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Mood Selection */}
      <Card className="glow-soft border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">How are you feeling right now?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.id;
              
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-4 rounded-xl transition-all duration-300 border-2 ${
                    isSelected 
                      ? "border-primary bg-primary/10 scale-105 glow-soft" 
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${mood.color} ${isSelected ? "animate-bounce" : ""}`} />
                  <div className="text-sm font-medium">{mood.label}</div>
                </button>
              );
            })}
          </div>

          {selectedMood && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Intensity: {intensity}/10
                </label>
                <div className="flex items-center space-x-2">
                  {[...Array(10)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIntensity(i + 1)}
                      className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                        i < intensity
                          ? "bg-primary border-primary scale-110"
                          : "border-border hover:border-primary/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleSubmit} 
                className="w-full glow-soft"
                size="lg"
              >
                Record Mood (+10 XP)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Insights */}
      <Card className="mood-card border-accent/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-white mb-2">Today's Insight</h3>
          <p className="text-white/80 text-sm">
            "Every small step towards understanding your emotions is a victory. You're building emotional awareness one moment at a time."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}