import { Button } from "@/components/ui/button";
import { MessageSquarePlus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="text-center rounded-3xl p-16 backdrop-blur-sm border border-white/30">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-600 leading-tight tracking-tight mb-4 pb-1">
          Ready to Send Your First Message?
        </h2>
        <p className=" mb-8 text-lg md:text-xl text-slate-600 leading-relaxed font-light">
          Join thousands who trust us with their most meaningful messages
        </p>
        <Button
          onClick={() => navigate('/create-message')}
          size="lg"
          className="bg-gradient-to-r hover:from-cyan-200 hover:to-blue-300 
               from-blue-200 to-purple-300 
               text-white px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <MessageSquarePlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Create Your Message
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
