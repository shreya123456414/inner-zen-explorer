import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Music,
  Waves,
  Wind,
  Zap,
  Heart,
  Moon,
  Sun,
  TreePine
} from "lucide-react";

interface SoundTrack {
  id: string;
  name: string;
  description: string;
  mood: string;
  icon: any;
  frequency?: number; // For binaural beats
  color: string;
}

const soundTracks: SoundTrack[] = [
  {
    id: "rain",
    name: "Gentle Rain",
    description: "Soft rainfall for relaxation and focus",
    mood: "calm",
    icon: Waves,
    color: "text-blue-500"
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    description: "Rhythmic waves for deep relaxation",
    mood: "peaceful",
    icon: Waves,
    color: "text-cyan-500"
  },
  {
    id: "forest",
    name: "Forest Ambience",
    description: "Birds chirping in a peaceful forest",
    mood: "grounded",
    icon: TreePine,
    color: "text-green-500"
  },
  {
    id: "wind",
    name: "Gentle Breeze",
    description: "Soft wind through leaves",
    mood: "refreshing",
    icon: Wind,
    color: "text-emerald-500"
  },
  {
    id: "alpha",
    name: "Alpha Waves (8-12 Hz)",
    description: "Binaural beats for relaxation and creativity",
    mood: "focused",
    icon: Zap,
    frequency: 10,
    color: "text-purple-500"
  },
  {
    id: "theta",
    name: "Theta Waves (4-8 Hz)",
    description: "Deep meditation and emotional healing",
    mood: "meditative",
    icon: Heart,
    frequency: 6,
    color: "text-pink-500"
  },
  {
    id: "delta",
    name: "Delta Waves (0.5-4 Hz)",
    description: "Deep sleep and restoration",
    mood: "sleepy",
    icon: Moon,
    frequency: 2,
    color: "text-indigo-500"
  }
];

const MoodBasedPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<SoundTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playTrack = (track: SoundTrack) => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
      return;
    }

    stopTrack();
    setCurrentTrack(track);
    
    if (track.frequency) {
      // Play binaural beats
      playBinauralBeats(track.frequency);
    } else {
      // Play nature sounds (simulated with pink noise for demo)
      playNatureSound(track.id);
    }
    
    setIsPlaying(true);
  };

  const playBinauralBeats = (frequency: number) => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    
    // Create oscillators for left and right channels
    const leftOscillator = audioContext.createOscillator();
    const rightOscillator = audioContext.createOscillator();
    
    // Create gain nodes
    const leftGain = audioContext.createGain();
    const rightGain = audioContext.createGain();
    
    // Create merger for stereo
    const merger = audioContext.createChannelMerger(2);
    
    // Set frequencies (binaural beat = difference between left and right)
    leftOscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    rightOscillator.frequency.setValueAtTime(200 + frequency, audioContext.currentTime);
    
    // Set volume
    const vol = volume[0] / 200; // Lower volume for binaural beats
    leftGain.gain.setValueAtTime(vol, audioContext.currentTime);
    rightGain.gain.setValueAtTime(vol, audioContext.currentTime);
    
    // Connect nodes
    leftOscillator.connect(leftGain);
    rightOscillator.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(audioContext.destination);
    
    // Start oscillators
    leftOscillator.start();
    rightOscillator.start();
    
    // Store references for cleanup
    oscillatorRef.current = leftOscillator;
  };

  const playNatureSound = (soundId: string) => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    
    // Create pink noise for nature sound simulation
    const bufferSize = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    // Generate pink noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // Reduce volume
      b6 = white * 0.115926;
    }
    
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    source.buffer = buffer;
    source.loop = true;
    gainNode.gain.setValueAtTime(volume[0] / 100, audioContext.currentTime);
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    source.start();
    
    oscillatorRef.current = source as any;
    gainNodeRef.current = gainNode;
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
      oscillatorRef.current = null;
    }
  };

  const stopTrack = () => {
    pauseTrack();
    setCurrentTrack(null);
    setCurrentTime(0);
  };

  const updateVolume = (newVolume: number[]) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVolume[0] / 100, audioContextRef.current?.currentTime || 0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-healing bg-clip-text text-transparent">
          Sound Therapy
        </h2>
        <p className="text-muted-foreground">
          Therapeutic sounds and binaural beats for mental wellness
        </p>
      </div>

      {/* Current Track Player */}
      {currentTrack && (
        <Card className="glow-soft border-primary/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <currentTrack.icon className={`w-6 h-6 ${currentTrack.color}`} />
                <h3 className="text-lg font-semibold">{currentTrack.name}</h3>
              </div>
              
              <p className="text-sm text-muted-foreground">{currentTrack.description}</p>
              
              {currentTrack.frequency && (
                <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full inline-block">
                  {currentTrack.frequency} Hz Binaural Beat
                </div>
              )}

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="icon">
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button 
                  onClick={() => playTrack(currentTrack)} 
                  size="icon" 
                  className="w-12 h-12"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                
                <Button variant="outline" size="icon">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={volume}
                  onValueChange={updateVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-8">{volume[0]}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Track Selection */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold text-center">Choose Your Sound</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {soundTracks.map((track) => {
            const Icon = track.icon;
            const isCurrentTrack = currentTrack?.id === track.id;
            
            return (
              <Card 
                key={track.id}
                className={`glow-soft cursor-pointer transition-all group ${
                  isCurrentTrack 
                    ? "border-primary/40 bg-primary/5" 
                    : "border-primary/20 hover:border-primary/30"
                }`}
                onClick={() => playTrack(track)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCurrentTrack ? "bg-primary/20" : "bg-primary/10 group-hover:bg-primary/15"
                    }`}>
                      <Icon className={`w-5 h-5 ${track.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{track.name}</h4>
                      <p className="text-xs text-muted-foreground">{track.description}</p>
                      <div className="mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          track.mood === 'calm' ? 'bg-blue-100 text-blue-700' :
                          track.mood === 'peaceful' ? 'bg-cyan-100 text-cyan-700' :
                          track.mood === 'grounded' ? 'bg-green-100 text-green-700' :
                          track.mood === 'focused' ? 'bg-purple-100 text-purple-700' :
                          track.mood === 'meditative' ? 'bg-pink-100 text-pink-700' :
                          track.mood === 'sleepy' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {track.mood}
                        </span>
                      </div>
                    </div>

                    {isCurrentTrack && isPlaying && (
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoodBasedPlayer;