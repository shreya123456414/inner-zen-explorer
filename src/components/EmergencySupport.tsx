import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  Heart, 
  MapPin, 
  Clock,
  ExternalLink,
  Shield
} from "lucide-react";

interface EmergencyResource {
  id: string;
  name: string;
  description: string;
  contact: string;
  availability: string;
  icon: any;
  type: "crisis" | "text" | "local" | "online";
  urgent?: boolean;
}

const emergencyResources: EmergencyResource[] = [
  {
    id: "988",
    name: "988 Suicide & Crisis Lifeline",
    description: "Free and confidential emotional support 24/7",
    contact: "Call or text 988",
    availability: "24/7/365",
    icon: Phone,
    type: "crisis",
    urgent: true
  },
  {
    id: "crisis-text",
    name: "Crisis Text Line",
    description: "Text-based crisis support from trained counselors",
    contact: "Text HOME to 741741",
    availability: "24/7/365",
    icon: MessageSquare,
    type: "text",
    urgent: true
  },
  {
    id: "samhsa",
    name: "SAMHSA National Helpline",
    description: "Treatment referral and information service",
    contact: "1-800-662-4357",
    availability: "24/7/365",
    icon: Phone,
    type: "crisis"
  },
  {
    id: "veterans",
    name: "Veterans Crisis Line",
    description: "Support for veterans and their families",
    contact: "Call 988, Press 1",
    availability: "24/7/365",
    icon: Shield,
    type: "crisis"
  },
  {
    id: "trevor",
    name: "The Trevor Project",
    description: "Crisis support for LGBTQ+ youth",
    contact: "1-866-488-7386",
    availability: "24/7/365",
    icon: Heart,
    type: "crisis"
  },
  {
    id: "rainn",
    name: "RAINN National Sexual Assault Hotline",
    description: "Support for survivors of sexual violence",
    contact: "1-800-656-4673",
    availability: "24/7/365",
    icon: Shield,
    type: "crisis"
  }
];

const copingStrategies = [
  {
    title: "Immediate Grounding",
    technique: "5-4-3-2-1 Technique",
    description: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste"
  },
  {
    title: "Breathing Exercise",
    technique: "Box Breathing",
    description: "Breathe in for 4, hold for 4, exhale for 4, hold for 4. Repeat."
  },
  {
    title: "Physical Release",
    technique: "Cold Water",
    description: "Splash cold water on your face or hold ice cubes to activate your vagus nerve"
  },
  {
    title: "Distraction",
    technique: "Counting Backwards",
    description: "Count backwards from 100 by 7s or name animals from A-Z"
  }
];

const warningSignsToWatch = [
  "Thoughts of death or suicide",
  "Feeling hopeless or trapped",
  "Talking about being a burden",
  "Withdrawing from activities",
  "Extreme mood swings",
  "Giving away possessions",
  "Increased use of alcohol or drugs",
  "Sleeping too little or too much"
];

export default function EmergencySupport() {
  const handleCall = (number: string) => {
    // Remove non-numeric characters for tel link
    const cleanNumber = number.replace(/[^\d]/g, '');
    if (cleanNumber) {
      window.location.href = `tel:${cleanNumber}`;
    }
  };

  const handleText = (shortcode: string) => {
    // For text messages, we'll show instructions since we can't directly trigger SMS with message
    alert(`To use Crisis Text Line:\n1. Open your messaging app\n2. Text HOME to ${shortcode}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
          Emergency Support
        </h2>
        <p className="text-muted-foreground">
          Immediate help and resources for mental health crises
        </p>
      </div>

      {/* Crisis Alert */}
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-700">
          <strong>If you are in immediate danger or having thoughts of suicide:</strong>
          <div className="mt-2 space-y-1">
            <div>• Call 911 (Emergency Services)</div>
            <div>• Call or text 988 (Suicide & Crisis Lifeline)</div>
            <div>• Go to your nearest emergency room</div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Emergency Contacts */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold text-center">24/7 Crisis Support</h3>
        
        {emergencyResources.filter(r => r.urgent).map((resource) => {
          const Icon = resource.icon;
          return (
            <Card 
              key={resource.id}
              className="glow-soft border-red-300 hover:border-red-400 transition-all bg-red-50/50"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900">{resource.name}</h4>
                    <p className="text-sm text-red-700 mb-2">{resource.description}</p>
                    <div className="flex items-center gap-2 text-xs text-red-600">
                      <Clock className="w-3 h-3" />
                      <span>{resource.availability}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <Button
                      onClick={() => {
                        if (resource.type === "text" && resource.contact.includes("741741")) {
                          handleText("741741");
                        } else if (resource.contact.includes("988")) {
                          handleCall("988");
                        } else {
                          const phoneMatch = resource.contact.match(/[\d-]+/);
                          if (phoneMatch) handleCall(phoneMatch[0]);
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700"
                      size="sm"
                    >
                      {resource.type === "text" ? "Text Now" : "Call Now"}
                    </Button>
                    <div className="text-xs text-red-600 mt-1 font-mono">
                      {resource.contact}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Resources */}
      <Card className="glow-soft border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {emergencyResources.filter(r => !r.urgent).map((resource) => {
              const Icon = resource.icon;
              return (
                <div key={resource.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{resource.name}</h5>
                      <p className="text-xs text-muted-foreground mb-1">{resource.description}</p>
                      <div className="text-xs font-mono text-primary">{resource.contact}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Immediate Coping Strategies */}
      <Card className="glow-soft border-healing/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-healing" />
            Immediate Coping Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {copingStrategies.map((strategy, index) => (
              <div key={index} className="p-3 bg-healing/5 rounded-lg border border-healing/20">
                <div className="font-medium text-sm text-healing mb-1">{strategy.title}</div>
                <div className="font-semibold text-sm mb-2">{strategy.technique}</div>
                <div className="text-xs text-muted-foreground">{strategy.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Warning Signs */}
      <Card className="glow-soft border-amber-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Warning Signs to Watch For
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-3">
            If you or someone you know shows these signs, reach out for help immediately:
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {warningSignsToWatch.map((sign, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <span>{sign}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* International Resources Note */}
      <Card className="glow-soft border-blue-300">
        <CardContent className="p-4 text-center">
          <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-2" />
          <div className="text-sm text-blue-700">
            <strong>International Support:</strong> If you're outside the US, visit{" "}
            <a 
              href="https://www.iasp.info/resources/Crisis_Centres/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              IASP Crisis Centers
            </a>{" "}
            for local resources.
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground">
        Remember: Seeking help is a sign of strength, not weakness. You are not alone.
      </div>
    </div>
  );
}