import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles, Heart, Star, Mic, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  aiInsight?: string;
  emotions?: string[];
}

interface JournalProps {
  onEntrySubmit: (entry: Omit<JournalEntry, "id" | "timestamp">) => void;
  entries: JournalEntry[];
}

export default function Journal({ onEntrySubmit, entries }: JournalProps) {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMood, setCurrentMood] = useState("");
  const [showPrompts, setShowPrompts] = useState(false);

  const journalPrompts = [
    "What am I grateful for today?",
    "How did I show kindness to myself today?",
    "What challenged me today and how did I handle it?",
    "What made me smile or laugh today?",
    "What's one thing I learned about myself today?",
    "How am I feeling in my body right now?",
    "What would I tell a friend who's going through what I'm experiencing?",
    "What's one small victory I can celebrate today?"
  ];

  const analyzeEntry = async (text: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis (replace with actual Gemini API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis results
    const emotions = ["hopeful", "reflective", "grateful"];
    const mood = "calm";
    const insight = "Your writing shows a beautiful balance of self-reflection and gratitude. The themes of growth and acceptance are strong indicators of emotional resilience.";
    
    setCurrentMood(mood);
    setIsAnalyzing(false);
    
    onEntrySubmit({
      content: text,
      mood,
      emotions,
      aiInsight: insight
    });

    toast({
      title: "Entry Saved ✨",
      description: "Your journal entry has been analyzed and saved.",
    });

    setContent("");
  };

  const handleSubmit = () => {
    if (content.trim().length < 10) {
      toast({
        title: "Entry too short",
        description: "Please write at least a few sentences to get meaningful insights.",
        variant: "destructive"
      });
      return;
    }
    
    analyzeEntry(content);
  };

  const insertPrompt = (prompt: string) => {
    setContent(prompt + "\n\n");
    setShowPrompts(false);
  };

  return (
    <div className="space-y-6">
      {/* Journal Writing Area */}
      <Card className="glow-soft border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Digital Journal
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPrompts(!showPrompts)}
              className="text-xs"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Prompts
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showPrompts && (
            <div className="mb-4 p-4 bg-gradient-calm rounded-lg animate-fade-in">
              <h4 className="font-medium text-white mb-3">Journal Prompts</h4>
              <div className="grid gap-2">
                {journalPrompts.slice(0, 4).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => insertPrompt(prompt)}
                    className="text-left text-sm text-white/80 hover:text-white p-2 rounded hover:bg-white/10 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How are you feeling today? What's on your mind? Write freely..."
            className="min-h-32 resize-none border-primary/20 focus:border-primary/40"
            disabled={isAnalyzing}
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {content.length} characters
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="opacity-50"
              >
                <Mic className="w-4 h-4 mr-1" />
                Voice (Soon)
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={content.length < 10 || isAnalyzing}
                className="glow-soft"
                size="sm"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-1 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save & Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <Card className="glow-soft border-healing/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-healing" />
              Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="journal-entry">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {entry.mood}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {entry.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                  
                  <p className="text-sm text-foreground/80 mb-3 line-clamp-3">
                    {entry.content}
                  </p>
                  
                  {entry.emotions && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {entry.emotions.map((emotion) => (
                        <Badge key={emotion} variant="secondary" className="text-xs">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {entry.aiInsight && (
                    <div className="bg-healing/10 border border-healing/20 rounded-lg p-3 mt-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-healing" />
                        <span className="text-xs font-medium text-healing">AI Insight</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{entry.aiInsight}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}