import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Brain, 
  Heart, 
  AlertCircle,
  CheckCircle,
  Target,
  Activity,
  Zap,
  Moon,
  Sun
} from "lucide-react";

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

interface AnalyzerProps {
  moodHistory: MoodEntry[];
  journalEntries: JournalEntry[];
}

interface Pattern {
  type: string;
  description: string;
  confidence: number;
  impact: "positive" | "negative" | "neutral";
  icon: any;
}

interface Insight {
  category: string;
  message: string;
  type: "improvement" | "concern" | "achievement";
  icon: any;
}

export default function MentalHealthAnalyzer({ moodHistory, journalEntries }: AnalyzerProps) {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("month");

  // Filter data based on timeframe
  const filteredMoods = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    
    if (timeframe === "week") {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeframe === "month") {
      cutoff.setMonth(now.getMonth() - 1);
    } else {
      return moodHistory;
    }
    
    return moodHistory.filter(mood => mood.timestamp >= cutoff);
  }, [moodHistory, timeframe]);

  const filteredJournals = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    
    if (timeframe === "week") {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeframe === "month") {
      cutoff.setMonth(now.getMonth() - 1);
    } else {
      return journalEntries;
    }
    
    return journalEntries.filter(entry => entry.timestamp >= cutoff);
  }, [journalEntries, timeframe]);

  // Calculate mood statistics
  const moodStats = useMemo(() => {
    if (filteredMoods.length === 0) {
      return { average: 0, trend: 0, variance: 0, mostCommon: "none" };
    }

    const intensities = filteredMoods.map(m => m.intensity);
    const average = intensities.reduce((a, b) => a + b, 0) / intensities.length;
    
    // Calculate trend (last 7 days vs previous 7 days)
    const recent = filteredMoods.slice(-7);
    const previous = filteredMoods.slice(-14, -7);
    
    const recentAvg = recent.length > 0 ? recent.reduce((a, b) => a + b.intensity, 0) / recent.length : average;
    const previousAvg = previous.length > 0 ? previous.reduce((a, b) => a + b.intensity, 0) / previous.length : average;
    const trend = recentAvg - previousAvg;

    // Calculate variance
    const variance = intensities.reduce((a, b) => a + Math.pow(b - average, 2), 0) / intensities.length;

    // Most common mood
    const moodCounts = filteredMoods.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommon = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b, ["none", 0])[0];

    return { average, trend, variance, mostCommon };
  }, [filteredMoods]);

  // Detect patterns
  const patterns = useMemo((): Pattern[] => {
    const detectedPatterns: Pattern[] = [];

    // Weekend vs weekday mood pattern
    const weekendMoods = filteredMoods.filter(m => {
      const day = m.timestamp.getDay();
      return day === 0 || day === 6;
    });
    const weekdayMoods = filteredMoods.filter(m => {
      const day = m.timestamp.getDay();
      return day > 0 && day < 6;
    });

    if (weekendMoods.length > 2 && weekdayMoods.length > 2) {
      const weekendAvg = weekendMoods.reduce((a, b) => a + b.intensity, 0) / weekendMoods.length;
      const weekdayAvg = weekdayMoods.reduce((a, b) => a + b.intensity, 0) / weekdayMoods.length;
      const difference = weekendAvg - weekdayAvg;

      if (Math.abs(difference) > 1) {
        detectedPatterns.push({
          type: "Weekend Pattern",
          description: difference > 0 ? 
            "You tend to feel better on weekends" : 
            "You tend to feel better on weekdays",
          confidence: Math.min(Math.abs(difference) * 20, 85),
          impact: difference > 0 ? "positive" : "negative",
          icon: Calendar
        });
      }
    }

    // Time of day pattern (if we had time data)
    // Morning vs evening moods would go here

    // Consistency pattern
    if (moodStats.variance < 2 && filteredMoods.length > 7) {
      detectedPatterns.push({
        type: "Stability Pattern",
        description: "Your mood has been relatively stable",
        confidence: 75,
        impact: "positive",
        icon: Target
      });
    } else if (moodStats.variance > 4) {
      detectedPatterns.push({
        type: "Volatility Pattern", 
        description: "Your mood shows significant variations",
        confidence: 70,
        impact: "neutral",
        icon: Activity
      });
    }

    // Journaling correlation
    if (filteredJournals.length > 5) {
      const journalDays = new Set(filteredJournals.map(j => j.timestamp.toDateString()));
      const moodOnJournalDays = filteredMoods.filter(m => 
        journalDays.has(m.timestamp.toDateString())
      );
      
      if (moodOnJournalDays.length > 3) {
        const journalMoodAvg = moodOnJournalDays.reduce((a, b) => a + b.intensity, 0) / moodOnJournalDays.length;
        const overallAvg = moodStats.average;
        
        if (journalMoodAvg > overallAvg + 0.5) {
          detectedPatterns.push({
            type: "Journaling Correlation",
            description: "You tend to feel better on days you journal",
            confidence: 65,
            impact: "positive",
            icon: Brain
          });
        }
      }
    }

    return detectedPatterns;
  }, [filteredMoods, filteredJournals, moodStats]);

  // Generate insights
  const insights = useMemo((): Insight[] => {
    const generatedInsights: Insight[] = [];

    // Trend insights
    if (moodStats.trend > 1) {
      generatedInsights.push({
        category: "Progress",
        message: "Your mood has been trending upward recently - great progress!",
        type: "achievement",
        icon: TrendingUp
      });
    } else if (moodStats.trend < -1) {
      generatedInsights.push({
        category: "Attention Needed",
        message: "Your mood has been declining lately. Consider reaching out for support.",
        type: "concern",
        icon: TrendingDown
      });
    }

    // Activity insights
    if (filteredMoods.length < 7 && timeframe === "month") {
      generatedInsights.push({
        category: "Tracking",
        message: "Try to log your mood more frequently for better insights.",
        type: "improvement",
        icon: Activity
      });
    }

    // Journal insights
    if (filteredJournals.length < 3 && timeframe === "month") {
      generatedInsights.push({
        category: "Self-Reflection",
        message: "Regular journaling can help improve self-awareness and mood.",
        type: "improvement", 
        icon: Brain
      });
    } else if (filteredJournals.length > 10) {
      generatedInsights.push({
        category: "Self-Care",
        message: "Excellent job maintaining a regular journaling practice!",
        type: "achievement",
        icon: CheckCircle
      });
    }

    // Mood range insights
    if (moodStats.average > 7) {
      generatedInsights.push({
        category: "Wellbeing",
        message: "You're maintaining a positive mood range - keep it up!",
        type: "achievement",
        icon: Heart
      });
    } else if (moodStats.average < 4) {
      generatedInsights.push({
        category: "Support",
        message: "Your average mood is quite low. Consider professional support.",
        type: "concern",
        icon: AlertCircle
      });
    }

    return generatedInsights;
  }, [moodStats, filteredMoods, filteredJournals, timeframe]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-healing bg-clip-text text-transparent">
          Mental Health Analysis
        </h2>
        <p className="text-muted-foreground">
          AI-powered insights into your mental health patterns and trends
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center gap-2">
        {(["week", "month", "all"] as const).map((period) => (
          <button
            key={period}
            onClick={() => setTimeframe(period)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeframe === period
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mood Statistics */}
        <Card className="glow-soft border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Mood Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {moodStats.average.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Average Mood</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className={`text-2xl font-bold ${
                  moodStats.trend > 0 ? "text-green-600" : 
                  moodStats.trend < 0 ? "text-red-600" : "text-muted-foreground"
                }`}>
                  {moodStats.trend > 0 ? "+" : ""}{moodStats.trend.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Trend</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Mood Stability</span>
                <span>{moodStats.variance < 2 ? "High" : moodStats.variance < 4 ? "Medium" : "Low"}</span>
              </div>
              <Progress 
                value={Math.max(0, 100 - (moodStats.variance * 20))} 
                className="h-2" 
              />
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Most Common Mood</div>
              <Badge variant="outline" className="capitalize">
                {moodStats.mostCommon}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Detected Patterns */}
        <Card className="glow-soft border-healing/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-healing" />
              Detected Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patterns.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No significant patterns detected yet. Keep tracking to discover insights!
              </p>
            ) : (
              <div className="space-y-3">
                {patterns.map((pattern, index) => {
                  const Icon = pattern.icon;
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        pattern.impact === "positive" ? "bg-green-50 border-green-200" :
                        pattern.impact === "negative" ? "bg-red-50 border-red-200" :
                        "bg-muted/50 border-border"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${
                          pattern.impact === "positive" ? "text-green-600" :
                          pattern.impact === "negative" ? "text-red-600" :
                          "text-muted-foreground"
                        }`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{pattern.type}</div>
                          <div className="text-sm text-muted-foreground">{pattern.description}</div>
                          <div className="mt-1">
                            <Progress value={pattern.confidence} className="h-1" />
                            <div className="text-xs text-muted-foreground mt-1">
                              {pattern.confidence}% confidence
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="glow-soft border-accent/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Keep tracking your mood and journaling to unlock personalized insights!
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {insights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-all ${
                        insight.type === "achievement" ? "bg-green-50 border-green-200 hover:bg-green-100" :
                        insight.type === "concern" ? "bg-red-50 border-red-200 hover:bg-red-100" :
                        "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${
                          insight.type === "achievement" ? "text-green-600" :
                          insight.type === "concern" ? "text-red-600" :
                          "text-blue-600"
                        }`} />
                        <div>
                          <div className="font-medium text-sm mb-1">{insight.category}</div>
                          <div className="text-sm text-muted-foreground">{insight.message}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}