
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface CookingTimerProps {
  minutes: number;
  onComplete: () => void;
  onStop: () => void;
}

const CookingTimer: React.FC<CookingTimerProps> = ({ minutes, onComplete, onStop }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for timer completion sound
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwgBjiL0fPOcSoGIm7A7+OZTP8VX7bp6qFPFwpDmt/0wG8hAjiEy/TQaykGImu78OaYTv8VXLPn7ahWGQxBpt7zymwfBz2DyPLVdiMHImG28+qZTv8VW7Dn7qxWGQxBpdz0w2wgBz2AyPLYdSMHIl628+mYTv8VWbHm7a1WGQxBgtD/');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            // Play completion sound
            if (audioRef.current) {
              audioRef.current.play().catch(() => {
                // Fallback if audio fails
                console.log('Timer completed!');
              });
            }
            // Show toast notification
            toast({
              title: "Timer Complete! 🔔",
              description: `Your ${minutes}-minute timer has finished.`,
              duration: 5000,
            });
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, minutes, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(minutes * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const stopAndClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onStop();
  };

  const progress = ((minutes * 60 - timeLeft) / (minutes * 60)) * 100;

  return (
    <div className="flex items-center gap-3 p-4 bg-white border-2 border-orange-200 rounded-lg shadow-sm">
      {/* Circular Progress */}
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${progress * 0.88} 88`}
            className={`transition-all duration-1000 ${
              isCompleted ? 'text-green-500' : timeLeft < 60 ? 'text-red-500' : 'text-orange-500'
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${
            isCompleted ? 'text-green-600' : timeLeft < 60 ? 'text-red-600' : 'text-orange-600'
          }`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {!isCompleted ? (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={toggleTimer}
              className="h-8 w-8 p-0"
            >
              {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={resetTimer}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">Complete!</span>
          </div>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={stopAndClose}
          className="text-gray-500 hover:text-gray-700"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default CookingTimer;
