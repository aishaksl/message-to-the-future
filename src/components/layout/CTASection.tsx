import { Button } from "@/components/ui/button";
import { MessageSquarePlus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="text-center bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-green-600/10 rounded-3xl p-16 backdrop-blur-sm border border-white/30">
        <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-6">
          Ready to Send Your First Message?
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Join thousands who trust us with their most meaningful messages
        </p>
        <Button
          onClick={() => navigate('/create-message')}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <MessageSquarePlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Create Your Message
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
