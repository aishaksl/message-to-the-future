import { MessageCreator } from "@/components/MessageCreator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, BarChart, Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const CreateMessage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigation = [
    { name: "Home", icon: Home, view: "hero" },
    { name: "Dashboard", icon: BarChart, view: "dashboard" },
    { name: "Create", icon: Plus, view: "create" },
    { name: "Sign In", icon: User, view: "signin" },
  ];

  const handleViewChange = (view: string) => {
    if (view === "hero") {
      navigate("/");
    } else {
      navigate(`/?view=${view}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col">
      <div className="hidden md:block p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <MessageCreator />
      </div>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                size="sm"
                onClick={() => handleViewChange(item.view)}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs ${
                  item.view === "create" ? "text-primary" : ""
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMessage;