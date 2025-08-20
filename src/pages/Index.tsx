import { useState, useEffect } from "react";
import { Hero } from "@/components/layout/Hero";
import { MessageCreator } from "@/components/message-creator";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { SignIn } from "@/components/auth/SignIn";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, MessageSquarePlus, BarChart3, LogIn, Menu } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<
    "hero" | "create" | "dashboard" | "signin"
  >("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get("view");
    if (view && ["hero", "create", "dashboard", "signin"].includes(view)) {
      setCurrentView(view as any);
    }

    // Listen for URL changes
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const view = urlParams.get("view");
      if (view && ["hero", "create", "dashboard", "signin"].includes(view)) {
        setCurrentView(view as any);
      } else {
        setCurrentView("hero");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigation = [
    { id: "hero", label: "Home", icon: Home },
    { id: "create", label: "Create Message", icon: MessageSquarePlus },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-6">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg shadow-slate-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-300 to-purple-600"></div>
                  <span className="text-xl font-light tracking-wide bg-gradient-to-br from-blue-300 to-purple-600 bg-clip-text text-transparent">
                    TimeCapsule
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-2">
                {navigation.map(({ id, label, icon: Icon }) => (
                  <Button
                    key={id}
                    variant="ghost"
                    onClick={() => {
                      setCurrentView(id as any);
                      window.history.pushState(
                        {},
                        "",
                        id === "hero" ? "/" : `/?view=${id}`
                      );
                    }}
                    className={`font-light tracking-wide transition-all duration-300 rounded-xl px-4 py-2 ${
                      currentView === id
                        ? "bg-gradient-to-br from-blue-300 to-purple-600 text-white shadow-md"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>

              {/* Theme Toggle for mobile */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <div className="flex flex-col space-y-4 mt-8">
                      {navigation.map(({ id, label, icon: Icon }) => (
                        <Button
                          key={id}
                          variant={currentView === id ? "default" : "ghost"}
                          onClick={() => {
                            setCurrentView(id as any);
                            setMobileMenuOpen(false);
                            window.history.pushState(
                              {},
                              "",
                              id === "hero" ? "/" : `/?view=${id}`
                            );
                          }}
                          className="justify-start font-normal"
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {label}
                        </Button>
                      ))}
                      <Button
                        variant={currentView === "signin" ? "default" : "ghost"}
                        onClick={() => {
                          setCurrentView("signin");
                          setMobileMenuOpen(false);
                        }}
                        className="justify-start font-normal"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                      <div className="pt-4 border-t">
                        <ThemeToggle />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop Sign In */}
              <div className="hidden md:block">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("signin")}
                  className={`font-light tracking-wide transition-all duration-300 rounded-xl px-4 py-2 ${
                    currentView === "signin"
                      ? "bg-gradient-to-br from-blue-300 to-purple-600 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 pb-20 md:pb-8 min-h-[calc(100vh-5rem)] md:min-h-auto">
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
                window.history.pushState(
                  {},
                  "",
                  id === "hero" ? "/" : `/?view=${id}`
                );
              }}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-1 ${
                currentView === id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">
                {label === "Create Message" ? "Create" : label}
              </span>
            </Button>
          ))}
          <Button
            variant="ghost"
            onClick={() => setCurrentView("signin")}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-1 ${
              currentView === "signin"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground"
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
