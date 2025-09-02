import { MessageCreator } from "@/components/message-creator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, BarChart, Plus, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const CreateMessage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Get editing message from navigation state
  const editingMessage = location.state?.editingMessage || null;

  // Check if user came from a button (not navbar) - detect if there's a referrer or specific navigation state
  const isFromButton = location.state?.fromButton || false;

  // Get the original source to avoid payment page loops
  const originalSource = location.state?.originalSource || "/";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Update document title based on mode
    document.title = editingMessage
      ? "Edit Message - Message to the Future"
      : "Create Message - Message to the Future";

    // Cleanup on unmount
    return () => {
      document.title = "Message to the Future";
    };
  }, [editingMessage]);

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
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col">
      {/* Desktop Header */}
      <div className="hidden md:block p-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(originalSource)}
            className="gap-2"
          >
            {isFromButton ? (
              <>
                <ArrowLeft className="h-5 w-5" style={{ color: "#938ef6" }} />
                <span
                  className="text-base font-normal"
                  style={{ color: "#938ef6" }}
                >
                  Back
                </span>
              </>
            ) : (
              <>
                <Home className="h-4 w-4" />
                Home
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      {isMobile && (
        <div className="md:hidden p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(originalSource)}
              className="gap-2"
            >
              <ArrowLeft className="h-5 w-5" style={{ color: "#938ef6" }} />
              <span
                className="text-base font-normal"
                style={{ color: "#938ef6" }}
              >
                Back
              </span>
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <MessageCreator editingMessage={editingMessage} />
      </div>
    </div>
  );
};

export default CreateMessage;
