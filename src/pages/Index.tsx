import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { MessageCreator } from "@/components/MessageCreator";
import { Dashboard } from "@/components/Dashboard";
import { SignIn } from "@/components/SignIn";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, MessageSquarePlus, BarChart3, LogIn, Menu } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<"hero" | "create" | "dashboard" | "signin">("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    if (view && ['hero', 'create', 'dashboard', 'signin'].includes(view)) {
      setCurrentView(view as any);
    }
    
    // Listen for URL changes
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const view = urlParams.get('view');
      if (view && ['hero', 'create', 'dashboard', 'signin'].includes(view)) {
        setCurrentView(view as any);
      } else {
        setCurrentView('hero');
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigation = [
    { id: "hero", label: "Home", icon: Home },
    { id: "create", label: "Create Message", icon: MessageSquarePlus },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-medium text-foreground">
                TimeCapsule
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={currentView === id ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentView(id as any);
                    window.history.pushState({}, '', id === 'hero' ? '/' : `/?view=${id}`);
                  }}
                  className="font-normal"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>

            {/* Theme Toggle for mobile */}
            <div className="md:hidden">
              <ThemeToggle />
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <ThemeToggle />
              <Button 
                variant="outline" 
                className="font-normal"
                onClick={() => setCurrentView("signin")}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-20 md:pb-8 min-h-[calc(100vh-5rem)] md:min-h-auto">
        {currentView === "hero" && <Hero />}
        {currentView === "create" && <MessageCreator />}
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "signin" && <SignIn />}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigation.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="ghost"
              onClick={() => {
                setCurrentView(id as any);
                window.history.pushState({}, '', id === 'hero' ? '/' : `/?view=${id}`);
              }}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-1 ${
                currentView === id ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label === "Create Message" ? "Create" : label}</span>
            </Button>
          ))}
          <Button
            variant="ghost"
            onClick={() => setCurrentView("signin")}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-1 ${
              currentView === "signin" ? "text-primary bg-primary/10" : "text-muted-foreground"
            }`}
          >
            <LogIn className="w-5 h-5" />
            <span className="text-xs font-medium">Sign In</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
