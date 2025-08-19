import React from "react";
import { HeroSection } from "./HeroSection";
import HowItWorks from "./HowItWorksSection";
import { FeaturesSection } from "./FeaturesSection";
import { CTASection } from "./CTASection";

export const Hero: React.FC = () => {
  return (
    <div className="relative">
      {/* Hero Section - Full Screen */}
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden flex items-center justify-center">
        <div className="container mx-auto px-6 relative z-10">
          <HeroSection />
        </div>
      </section>

      {/* How It Works Section - Full Screen */}
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden flex items-center justify-center">
        <div className="container mx-auto px-6 relative z-10">
          <HowItWorks />
        </div>
      </section>

      {/* Features Section - Full Screen */}
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden flex items-center justify-center">
        <div className="container mx-auto px-6 relative z-10">
          <FeaturesSection />
        </div>
      </section>

      {/* CTA Section - Full Screen */}
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden flex items-center justify-center">
        <div className="container mx-auto px-6 relative z-10">
          <CTASection />
        </div>
      </section>
    </div>
  );
};
