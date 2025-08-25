import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col justify-center items-center text-center px-4 space-y-3 md:space-y-6">
      {/* Current Time Display - Clean and Minimal */}
      <div className="space-y-2">
        <div className="text-2xl font-mono font-light text-slate-500 tracking-widest">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-slate-400 font-light tracking-wide">
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Main Content - Zen Minimalist Design */}
      <div className="space-y-3 md:space-y-6 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-600 leading-tight tracking-tight">
          Life is Fleeting
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-500 to-blue-600 opacity-30">Love is Eternal</span>
        </h1>

        <div className="w-16 h-px bg-slate-300 mx-auto"></div>

        <div className="space-y-2 md:space-y-4 max-w-2xl mx-auto">
          <p className="text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed font-light">
            Every moment passes like sand through our fingers, but the love we share transcends time itself.
          </p>

          <p className="text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed font-light">
            Create timeless treasures that will touch hearts long after you're gone.
          </p>
        </div>
      </div>

      {/* Action Buttons - Minimal Design */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-6 items-center pt-2 md:pt-4">
        <Button
          onClick={() => navigate('/create-message', { state: { fromButton: true } })}
          size="lg"
          className="text-white font-bold px-6 py-3 rounded-lg 
               bg-[#938EF6]
               hover:bg-[#8279E6] hover:shadow- 
               transition-all"
        >
          <MessageSquarePlus className="w-4 h-4 mr-3" />
          Create Your Message

        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="text-white font-bold px-6 py-3 rounded-lg 
               bg-[#7bb9f3]
               hover:bg-[#51a5f5] hover:shadow- 
               transition-all duration-50 hover:text-white"
        >
          Watch Demo
        </Button>
      </div>
    </div>
  );
};
