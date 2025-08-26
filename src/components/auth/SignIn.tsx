import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Phone } from "lucide-react";

export const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden -mt-16 md:mt-0">


      {/* Decorative Background Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large bubbles */}
        <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 top-10 left-10" style={{ borderRadius: '50% 30% 70% 40%' }}></div>
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-pink-300/20 to-purple-400/20 top-32 right-16" style={{ borderRadius: '60% 40% 30% 70%' }}></div>
        <div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-cyan-300/15 to-blue-400/15 bottom-20 left-20" style={{ borderRadius: '40% 60% 70% 30%' }}></div>
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-violet-300/18 to-purple-500/18 top-16 right-1/3" style={{ borderRadius: '45% 55% 65% 35%' }}></div>

        {/* Medium bubbles */}
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200/30 to-orange-300/30 bottom-1/3 right-10" style={{ borderRadius: '30% 70% 40% 60%' }}></div>
        <div className="absolute w-18 h-18 rounded-full bg-gradient-to-br from-amber-300/22 to-yellow-400/22 top-2/3 left-1/2" style={{ borderRadius: '55% 45% 35% 65%' }}></div>

        {/* Small bubbles */}
        <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-emerald-200/25 to-teal-300/25 top-1/4 left-1/4" style={{ borderRadius: '65% 35% 45% 55%' }}></div>
        <div className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-rose-200/20 to-pink-300/20 bottom-1/4 right-1/4" style={{ borderRadius: '35% 65% 55% 45%' }}></div>
        <div className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-sky-200/30 to-cyan-300/30 top-3/4 right-3/4" style={{ borderRadius: '50% 50% 30% 70%' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-600 bg-clip-text text-transparent mb-3 md:mt-12">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-lg font-light">
            {isSignUp
              ? "Start your journey through time"
              : "Continue your journey through time"
            }
          </p>
        </div>

        <div className="bg-white/90 dark:bg-card/50 backdrop-blur-xl border border-slate-200/50 dark:border-border/50 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-700 to-slate-600 dark:from-foreground dark:to-foreground/70 bg-clip-text text-transparent">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {isSignUp && (
              <div className="space-y-1">
                <Input
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-10 md:h-12 bg-white/50 dark:bg-background/50 border-slate-200/50 dark:border-border/50 rounded-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-400 hover:border-slate-300 dark:hover:border-border"
                  required={isSignUp}
                />
              </div>
            )}

            <div className="space-y-1">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="h-10 md:h-12 bg-white/50 dark:bg-background/50 border-slate-200/50 rounded-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-400 hover:border-blue-300"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-10 md:h-12 bg-white/50 dark:bg-background/50 border-slate-200/50 dark:border-border/50 rounded-xl pr-12 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-400 hover:border-blue-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-blue-300 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Button variant="link" className="px-0 text-sm">
                  Forgot password?
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full h-10 md:h-12 rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500  text-white font-medium shadow-lg shadow-blue-300/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300/30 hover:scale-[1.02]">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="relative my-4 md:my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-10 md:h-12 rounded-xl bg-white/50 dark:bg-background/50 border-slate-200/50 dark:border-border/50 transition-all duration-200 hover:bg-white dark:hover:bg-background/70 hover:border-slate-300 dark:hover:border-border hover:shadow-md">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium">Google</span>
            </Button>
            <Button variant="outline" className="h-10 md:h-12 rounded-xl bg-white/50 dark:bg-background/50 border-slate-200/50 dark:border-border/50 transition-all duration-200 hover:bg-white dark:hover:bg-background/70 hover:border-slate-300 dark:hover:border-border hover:shadow-md">
              <Phone className="mr-2 h-4 w-4" />
              <span className="font-medium">Phone</span>
            </Button>
          </div>

          <div className="text-center mt-4 md:mt-6">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Button
                variant="link"
                className="px-0 text-sm font-medium text-blue-300 hover:text-purple-600 transition-colors duration-200"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Button>
            </p>
          </div>

          {isSignUp && (
            <p className="text-xs text-muted-foreground text-center mt-3 md:mt-4">
              By creating an account, you agree to our{" "}
              <Button variant="link" className="px-0 text-xs text-blue-300 hover:text-purple-600 transition-colors duration-200">
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button variant="link" className="px-0 text-xs text-blue-300 hover:text-purple-600 transition-colors duration-200">
                Privacy Policy
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};