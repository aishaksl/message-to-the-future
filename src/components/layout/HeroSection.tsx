import { Button } from "@/components/ui/button";
import { MessageSquarePlus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col justify-center text-center">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-slate-800 mb-8 leading-tight">
        Send Love Through{" "}
        <span className="font-medium bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
          Time
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
        Create meaningful messages that travel through time to reach your loved ones
        exactly when they need them most.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={() => navigate('/create-message')}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <MessageSquarePlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Start Your Journey
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="text-slate-600 hover:text-slate-800 px-8 py-4 text-lg rounded-full hover:bg-white/50 transition-all duration-300"
        >
          Watch Demo
        </Button>
      </div>
    </div>
  );
};