import { Button } from "@/components/ui/button";
import { MessageSquarePlus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
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
    <div className="h-full flex flex-col justify-center items-center text-center px-4 space-y-8">
      {/* Current Time Display - Clean and Minimal */}
      <div className="space-y-2">
        <div className="text-2xl font-mono font-light text-slate-600 tracking-widest">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-slate-400 font-light tracking-wide">
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Main Content - Zen Minimalist Design */}
      <div className="space-y-6 max-w-4xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-slate-800 leading-tight tracking-tight">
          Life is Fleeting
          <br />
          <span className="text-slate-600">Love is Eternal</span>
        </h1>

        <div className="w-16 h-px bg-slate-300 mx-auto"></div>

        <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-light max-w-2xl mx-auto">
          Every moment passes like sand through our fingers, but the love we share transcends time itself.
        </p>
      </div>

      {/* Action Buttons - Minimal Design */}
      <div className="flex flex-col sm:flex-row gap-6 items-center pt-4">
        <Button
          onClick={() => navigate('/create-message')}
          size="lg"
          className="bg-slate-800 hover:bg-slate-900 text-white px-10 py-4 text-base rounded-none border-0 shadow-none hover:shadow-none transition-colors duration-300 font-light tracking-wide"
        >
          <MessageSquarePlus className="w-4 h-4 mr-3" />
          Create Your Legacy
          <ArrowRight className="w-4 h-4 ml-3" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="text-slate-500 hover:text-slate-700 px-8 py-4 text-base rounded-none hover:bg-transparent transition-colors duration-300 font-light tracking-wide"
        >
          Watch Demo
        </Button>
      </div>
    </div>
  );
};
