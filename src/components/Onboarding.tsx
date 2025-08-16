import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, Shield, Brain, Sparkles } from "lucide-react";

interface OnboardingData {
  mentalHealthHistory: string[];
  currentTreatment: string;
  medication: string;
  crisisSupport: string;
  responseStyle: string;
}

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    mentalHealthHistory: [],
    currentTreatment: "",
    medication: "",
    crisisSupport: "",
    responseStyle: "",
  });

  const mentalHealthOptions = [
    "Anxiety",
    "Depression", 
    "Bipolar disorder",
    "PTSD",
    "ADHD",
    "None",
    "Prefer not to say"
  ];

  const handleMentalHealthChange = (condition: string, checked: boolean) => {
    if (checked) {
      setData(prev => ({
        ...prev,
        mentalHealthHistory: [...prev.mentalHealthHistory, condition]
      }));
    } else {
      setData(prev => ({
        ...prev,
        mentalHealthHistory: prev.mentalHealthHistory.filter(c => c !== condition)
      }));
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-calm animate-fade-in">
      <Card className="w-full max-w-2xl glow-soft border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-healing rounded-full flex items-center justify-center animate-pulse-healing">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-healing bg-clip-text text-transparent">
            Inner Zen Explorer
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Your personalized mental health companion
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <Brain className="mx-auto w-12 h-12 text-primary mb-4 animate-float" />
                <h2 className="text-2xl font-semibold mb-2">Mental Health History</h2>
                <p className="text-muted-foreground">
                  Do you currently experience or have a history of any of the following?
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {mentalHealthOptions.map((condition) => (
                  <div key={condition} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                    <Checkbox
                      id={condition}
                      checked={data.mentalHealthHistory.includes(condition)}
                      onCheckedChange={(checked) => handleMentalHealthChange(condition, checked as boolean)}
                    />
                    <Label htmlFor={condition} className="cursor-pointer flex-1">{condition}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <Shield className="mx-auto w-12 h-12 text-healing mb-4 animate-float" />
                <h2 className="text-2xl font-semibold mb-2">Current Treatment</h2>
                <p className="text-muted-foreground">
                  Are you currently under treatment or seeing a mental health professional?
                </p>
              </div>
              <RadioGroup value={data.currentTreatment} onValueChange={(value) => setData(prev => ({ ...prev, currentTreatment: value }))}>
                {["Yes", "No", "Prefer not to say"].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-healing/5 transition-colors">
                    <RadioGroupItem value={option} id={`treatment-${option}`} />
                    <Label htmlFor={`treatment-${option}`} className="cursor-pointer flex-1">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <Heart className="mx-auto w-12 h-12 text-accent mb-4 animate-breathe" />
                <h2 className="text-2xl font-semibold mb-2">Medication</h2>
                <p className="text-muted-foreground">
                  Are you currently taking any mental health medication?
                </p>
              </div>
              <RadioGroup value={data.medication} onValueChange={(value) => setData(prev => ({ ...prev, medication: value }))}>
                {["Yes", "No", "Prefer not to say"].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/5 transition-colors">
                    <RadioGroupItem value={option} id={`medication-${option}`} />
                    <Label htmlFor={`medication-${option}`} className="cursor-pointer flex-1">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <Shield className="mx-auto w-12 h-12 text-primary mb-4 animate-pulse-healing" />
                <h2 className="text-2xl font-semibold mb-2">Crisis Support</h2>
                <p className="text-muted-foreground">
                  Would you like the app to provide crisis support if signs of severe distress are detected?
                </p>
              </div>
              <RadioGroup value={data.crisisSupport} onValueChange={(value) => setData(prev => ({ ...prev, crisisSupport: value }))}>
                {["Yes", "No"].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                    <RadioGroupItem value={option} id={`crisis-${option}`} />
                    <Label htmlFor={`crisis-${option}`} className="cursor-pointer flex-1">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <Sparkles className="mx-auto w-12 h-12 text-healing mb-4 animate-float" />
                <h2 className="text-2xl font-semibold mb-2">Response Style</h2>
                <p className="text-muted-foreground">
                  How would you like me to respond to you?
                </p>
              </div>
              <RadioGroup value={data.responseStyle} onValueChange={(value) => setData(prev => ({ ...prev, responseStyle: value }))}>
                {[
                  { value: "gentle", label: "Gentle", description: "Soft, nurturing responses with extra care" },
                  { value: "motivational", label: "Motivational", description: "Encouraging and energizing support" },
                  { value: "neutral", label: "Neutral", description: "Balanced, professional guidance" }
                ].map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-4 rounded-lg hover:bg-healing/5 transition-colors border border-border/50">
                    <RadioGroupItem value={option.value} id={`style-${option.value}`} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={`style-${option.value}`} className="cursor-pointer font-medium">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t border-border/50">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="px-8">
                Previous
              </Button>
            )}
            <div className="flex-1" />
            <Button 
              onClick={handleNext}
              className="px-8 glow-soft"
              disabled={
                (step === 1 && data.mentalHealthHistory.length === 0) ||
                (step === 2 && !data.currentTreatment) ||
                (step === 3 && !data.medication) ||
                (step === 4 && !data.crisisSupport) ||
                (step === 5 && !data.responseStyle)
              }
            >
              {step === 5 ? "Complete Setup" : "Next"}
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-primary scale-125" : "bg-border"
                }`} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}