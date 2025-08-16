import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Send, Bot, User, Heart, Brain, Phone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isEmergency?: boolean;
}

interface UserProfile {
  responseStyle: string;
  mentalHealthHistory: string[];
  currentTreatment: string;
  medication: string;
  crisisSupport: string;
}

interface ChatbotProps {
  userProfile: UserProfile;
}

// Emergency keywords and responses
const emergencyKeywords = [
  "suicide", "kill myself", "end my life", "hurt myself", "self-harm", 
  "cutting", "overdose", "pills", "die", "death", "hopeless", "worthless"
];

const crisisResources = {
  general: "988 Suicide & Crisis Lifeline",
  text: "Text HOME to 741741 (Crisis Text Line)",
  international: "International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/"
};

export default function MentalHealthChatbot({ userProfile }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: getWelcomeMessage(),
      sender: "bot",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [userProfile.responseStyle]);

  const getWelcomeMessage = () => {
    const style = userProfile.responseStyle;
    if (style === "gentle") {
      return "Hello, beautiful soul 💙 I'm here to listen and support you on your mental health journey. How are you feeling today?";
    } else if (style === "motivational") {
      return "Hey there, champion! 💪 I'm your AI mental health companion, ready to help you tackle whatever's on your mind. What's going on today?";
    }
    return "Hello! I'm your AI mental health companion. I'm here to provide support, resources, and a listening ear. How can I help you today?";
  };

  const detectCrisis = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return emergencyKeywords.some(keyword => lowerText.includes(keyword));
  };

  const generateCrisisResponse = (): string => {
    const responses = [
      "I'm very concerned about what you're sharing. Your life has value and meaning. Please reach out for immediate help:",
      "I hear that you're in tremendous pain right now. You don't have to go through this alone. Please contact:",
      "What you're feeling is valid, but I want you to be safe. There are people who want to help you right now:"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const resources = `
    
🆘 **Immediate Help Available:**
• **Call 988** - Suicide & Crisis Lifeline (24/7)
• **Text HOME to 741741** - Crisis Text Line
• **Call 911** - For immediate emergency
• **Go to your nearest emergency room**

You are not alone. These feelings can change. Help is available right now.`;

    return randomResponse + resources;
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Check for crisis situation
    if (detectCrisis(userMessage)) {
      setShowCrisisAlert(true);
      return generateCrisisResponse();
    }

    // Simulate AI response based on user profile and message
    const responses = await generateContextualResponse(userMessage);
    return responses;
  };

  const generateContextualResponse = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    const style = userProfile.responseStyle;

    // Anxiety responses
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("worried")) {
      if (style === "gentle") {
        return "I can sense the anxiety you're feeling, and I want you to know it's completely valid. Try taking three deep breaths with me: breathe in for 4 counts, hold for 4, exhale for 6. 🌸 Would you like to try a grounding exercise?";
      } else if (style === "motivational") {
        return "Anxiety is tough, but you're tougher! 💪 Let's tackle this together. Try the 5-4-3-2-1 technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. You've got this!";
      }
      return "Anxiety can feel overwhelming, but there are effective techniques to help manage it. Would you like to try a breathing exercise or learn about grounding techniques?";
    }

    // Depression responses
    if (lowerMessage.includes("depressed") || lowerMessage.includes("depression") || lowerMessage.includes("sad") || lowerMessage.includes("down")) {
      if (style === "gentle") {
        return "I hear you, and I'm so sorry you're feeling this way. Depression can make everything feel heavy and difficult. Please remember that what you're feeling is valid, and there is hope for brighter days. 💙 Small steps count - even just reaching out here shows strength.";
      } else if (style === "motivational") {
        return "I know depression feels like a heavy weight, but you're showing incredible strength by talking about it! 🌟 Every small step forward is a victory. What's one tiny thing that brought you even a moment of peace recently?";
      }
      return "Depression can be very challenging, and I'm glad you're reaching out. Remember that seeking help is a sign of strength, not weakness. Are you currently receiving professional support?";
    }

    // Sleep issues
    if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia") || lowerMessage.includes("tired")) {
      return "Sleep issues can significantly impact mental health. Some helpful strategies include maintaining a consistent sleep schedule, avoiding screens before bedtime, and creating a calming bedtime routine. Have you tried any relaxation techniques before sleep?";
    }

    // Stress responses  
    if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelmed") || lowerMessage.includes("pressure")) {
      if (style === "gentle") {
        return "Feeling overwhelmed is so human, and you're not alone in this feeling. 🌿 When stress builds up, our minds need gentle care. Try placing your hand on your heart and taking slow, deep breaths. What's feeling most overwhelming right now?";
      } else if (style === "motivational") {
        return "Stress is your mind's way of saying 'Hey, we need to tackle this!' 🎯 You've handled 100% of your tough days so far - that's a perfect track record! Let's break down what's overwhelming you into manageable pieces.";
      }
      return "Stress can feel overwhelming, but breaking things down into smaller, manageable steps can help. What's the main source of your stress right now?";
    }

    // General supportive responses
    const generalResponses = [
      "Thank you for sharing that with me. Your feelings are valid and important. What would be most helpful for you right now?",
      "I appreciate you opening up. It takes courage to talk about our mental health. How has your day been treating you?",
      "I'm here to listen and support you. What's been on your mind lately that you'd like to talk about?",
      "That sounds like it's been weighing on you. Sometimes just talking about things can help us process them better. Tell me more about how you're feeling."
    ];

    // Add style variations
    if (style === "gentle") {
      const gentleResponses = [
        "Thank you for trusting me with your feelings, dear soul. 💫 You're being so brave by reaching out. What gentle support do you need most right now?",
        "I can feel the courage it took to share that with me. 🌸 Your feelings matter deeply. How can I best support you in this moment?",
        "You're in a safe space here, beautiful human. 💙 Whatever you're feeling is completely valid. What would bring you the most peace right now?"
      ];
      return gentleResponses[Math.floor(Math.random() * gentleResponses.length)];
    } else if (style === "motivational") {
      const motivationalResponses = [
        "I love that you're taking charge of your mental health - that's champion behavior! 🚀 What's your next move gonna be?",
        "You're showing incredible self-awareness by talking about this! 💪 That's already a huge step forward. What victory, even a small one, can we celebrate today?",
        "Look at you being proactive about your wellbeing! 🌟 You're already on the right path. What goal are we crushing next?"
      ];
      return motivationalResponses[Math.floor(Math.random() * motivationalResponses.length)];
    }

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const botResponse = await generateResponse(userMessage.content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
        isEmergency: detectCrisis(userMessage.content)
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. If you're in crisis, please call 988 or your local emergency number immediately.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="space-y-4">
      {showCrisisAlert && userProfile.crisisSupport === "yes" && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            <strong>Crisis Support Activated:</strong> If you're having thoughts of self-harm, please reach out for immediate help. Your safety is the top priority.
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">Call 988</span> - Suicide & Crisis Lifeline
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card className="glow-soft border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Mental Health Companion
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Messages */}
          <ScrollArea className="h-96" ref={scrollAreaRef}>
            <div className="space-y-4 pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.isEmergency 
                        ? "bg-red-50 border border-red-200 text-red-800"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  {message.sender === "user" && (
                    <div className="w-8 h-8 bg-healing/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-healing" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            This AI companion provides support but is not a replacement for professional mental health care.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}