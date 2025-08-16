import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Heart, 
  Brain,
  Target,
  Timer,
  Wind
} from "lucide-react";

interface Game {
  id: string;
  name: string;
  description: string;
  icon: any;
  component: () => JSX.Element;
}

const BreathingGame = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setPhase((currentPhase) => {
              if (currentPhase === "inhale") {
                setTimeLeft(4);
                return "hold";
              } else if (currentPhase === "hold") {
                setTimeLeft(6);
                return "exhale";
              } else {
                setCycles(c => c + 1);
                setTimeLeft(4);
                return "inhale";
              }
            });
            return phase === "hold" ? 6 : 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, phase]);

  const toggleBreathing = () => {
    setIsActive(!isActive);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimeLeft(4);
    setCycles(0);
  };

  return (
    <div className="text-center space-y-6">
      <div className="relative w-48 h-48 mx-auto">
        <div 
          className={`w-full h-full rounded-full border-4 border-primary/30 flex items-center justify-center transition-all duration-1000 ${
            phase === "inhale" ? "scale-110 bg-primary/10" : 
            phase === "hold" ? "scale-110 bg-healing/10" : 
            "scale-90 bg-accent/10"
          }`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold capitalize text-primary">{phase}</div>
            <div className="text-4xl font-bold text-foreground">{timeLeft}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-muted-foreground">
          {phase === "inhale" ? "Breathe in slowly..." : 
           phase === "hold" ? "Hold your breath..." : 
           "Breathe out slowly..."}
        </p>

        <div className="flex gap-2 justify-center">
          <Button onClick={toggleBreathing} variant="default">
            {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button onClick={resetBreathing} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Completed cycles: <span className="font-semibold text-primary">{cycles}</span>
        </div>
      </div>
    </div>
  );
};

const MindfulnessGame = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = [
    "Notice 5 things you can see around you",
    "Notice 4 things you can touch",
    "Notice 3 things you can hear", 
    "Notice 2 things you can smell",
    "Notice 1 thing you can taste"
  ];

  const startExercise = () => {
    setIsActive(true);
    setCurrentStep(0);
    setProgress(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setProgress((currentStep + 1) / steps.length * 100);
    } else {
      setIsActive(false);
      setProgress(100);
    }
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentStep(0);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">5-4-3-2-1 Grounding Exercise</h3>
        <p className="text-muted-foreground text-sm">
          Use your senses to ground yourself in the present moment
        </p>
      </div>

      <Progress value={progress} className="h-2" />

      {!isActive && progress === 0 ? (
        <div className="text-center">
          <Button onClick={startExercise} className="w-full">
            <Target className="w-4 h-4 mr-2" />
            Start Grounding Exercise
          </Button>
        </div>
      ) : progress === 100 ? (
        <div className="text-center space-y-4">
          <div className="p-4 bg-healing/10 rounded-lg border border-healing/20">
            <Sparkles className="w-8 h-8 text-healing mx-auto mb-2" />
            <p className="text-healing font-semibold">Exercise Complete!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Great job grounding yourself in the present moment.
            </p>
          </div>
          <Button onClick={resetExercise} variant="outline" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="p-6 bg-card rounded-lg border border-primary/20">
            <div className="text-sm text-muted-foreground mb-2">
              Step {currentStep + 1} of {steps.length}
            </div>
            <p className="text-lg font-medium text-primary">
              {steps[currentStep]}
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={nextStep} className="flex-1">
              {currentStep === steps.length - 1 ? "Complete" : "Next Step"}
            </Button>
            <Button onClick={resetExercise} variant="outline">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const MemoryGame = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"waiting" | "playing" | "lost">("waiting");

  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];
  
  const startGame = () => {
    const newSequence = [Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setPlayerSequence([]);
    setScore(0);
    setGameState("playing");
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    setIsShowingSequence(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveButton(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveButton(null);
    }
    setIsShowingSequence(false);
  };

  const handleButtonClick = (index: number) => {
    if (isShowingSequence) return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameState("lost");
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      const newSequence = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      setPlayerSequence([]);
      setTimeout(() => showSequence(newSequence), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Memory Challenge</h3>
        <p className="text-muted-foreground text-sm">
          Follow the sequence to improve your working memory
        </p>
      </div>

      {gameState === "waiting" ? (
        <div className="text-center">
          <Button onClick={startGame} className="w-full">
            <Brain className="w-4 h-4 mr-2" />
            Start Memory Game
          </Button>
        </div>
      ) : gameState === "lost" ? (
        <div className="text-center space-y-4">
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <p className="font-semibold">Game Over!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Final Score: <span className="text-primary font-semibold">{score}</span>
            </p>
          </div>
          <Button onClick={startGame} variant="outline" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Score</div>
            <div className="text-2xl font-bold text-primary">{score}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {colors.map((color, index) => (
              <button
                key={index}
                className={`h-20 w-full rounded-lg transition-all duration-200 ${color} ${
                  activeButton === index ? "scale-110 brightness-125" : 
                  isShowingSequence ? "opacity-70" : "hover:scale-105"
                }`}
                onClick={() => handleButtonClick(index)}
                disabled={isShowingSequence}
              />
            ))}
          </div>

          {isShowingSequence && (
            <p className="text-center text-sm text-muted-foreground">
              Watch the sequence...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default function TherapeuticGames() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games: Game[] = [
    {
      id: "breathing",
      name: "4-4-6 Breathing",
      description: "Calm anxiety with guided breathing exercises",
      icon: Wind,
      component: BreathingGame
    },
    {
      id: "mindfulness",
      name: "5-4-3-2-1 Grounding",
      description: "Ground yourself using your five senses",
      icon: Target,
      component: MindfulnessGame
    },
    {
      id: "memory",
      name: "Memory Challenge",
      description: "Improve working memory and focus",
      icon: Brain,
      component: MemoryGame
    }
  ];

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    const GameComponent = game?.component;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <game.icon className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">{game?.name}</h2>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedGame(null)}
            size="sm"
          >
            ← Back to Games
          </Button>
        </div>

        <Card className="glow-soft border-primary/20">
          <CardContent className="p-6">
            {GameComponent && <GameComponent />}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-healing bg-clip-text text-transparent">
          Therapeutic Games
        </h2>
        <p className="text-muted-foreground">
          Interactive exercises to reduce stress and improve mental wellness
        </p>
      </div>

      <div className="grid gap-4">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <Card 
              key={game.id}
              className="glow-soft border-primary/20 hover:border-primary/40 transition-all cursor-pointer group"
              onClick={() => setSelectedGame(game.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{game.name}</h3>
                    <p className="text-muted-foreground text-sm">{game.description}</p>
                  </div>
                  <div className="text-primary group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}