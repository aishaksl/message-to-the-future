import React from "react";
import { HeroSection } from "./HeroSection";
import ContentTypesSection from "./ContentTypesSection";
import HowItWorks from "./HowItWorksSection";
import { FeaturesSection } from "./FeaturesSection";
import { CTASection } from "./CTASection";

export const Hero: React.FC = () => {
  return (
    <div className="relative">
      {/* Hero Section - Full Screen */}
      <section className="h-[calc(100vh-8rem)] md:h-[100vh] md:min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        {/* Decorative blobs */}
        <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 to-purple-300 top-20 left-10 opacity-40" style={{ borderRadius: '50% 30% 70% 40%' }}></div>
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-cyan-200 to-purple-300 bottom-32 right-16 opacity-50" style={{ borderRadius: '60% 40% 30% 70%' }}></div>
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-cyan-200 to-blue-300 top-1/3 right-1/4 opacity-30" style={{ borderRadius: '40% 60% 50% 30%' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <HeroSection />
        </div>
      </section>

      {/* Content Types Section - Full Screen */}
      <section className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center pt-16 md:pt-0">
        {/* Decorative blobs */}
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-green-200 to-teal-300 top-16 right-12 opacity-35" style={{ borderRadius: '70% 30% 40% 60%' }}></div>
        <div className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 bottom-20 left-8 opacity-45" style={{ borderRadius: '50% 30% 70% 40%' }}></div>
        <div className="absolute w-22 h-22 rounded-full bg-gradient-to-br from-purple-200 to-pink-300 top-2/3 left-1/3 opacity-25" style={{ borderRadius: '30% 70% 60% 40%' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <ContentTypesSection />
        </div>
      </section>

      {/* How It Works Section - Full Screen */}
      <section className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center md:pt-0">
        {/* Decorative blobs */}
        <div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-indigo-200 to-blue-300 top-24 left-16 opacity-30" style={{ borderRadius: '60% 40% 30% 70%' }}></div>
        <div className="absolute w-26 h-26 rounded-full bg-gradient-to-br from-rose-200 to-pink-300 bottom-28 right-20 opacity-40" style={{ borderRadius: '40% 60% 70% 30%' }}></div>
        <div className="absolute w-18 h-18 rounded-full bg-gradient-to-br from-emerald-200 to-green-300 top-1/2 right-1/3 opacity-35" style={{ borderRadius: '70% 30% 50% 50%' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <HowItWorks />
        </div>
      </section>

      {/* Features Section - Full Screen */}
      <section className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center pt-16 md:pt-0">
        {/* Decorative blobs */}
        <div className="absolute w-30 h-30 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300 top-32 right-24 opacity-45" style={{ borderRadius: '50% 30% 70% 40%' }}></div>
        <div className="absolute w-34 h-34 rounded-full bg-gradient-to-br from-violet-200 to-purple-300 bottom-16 left-12 opacity-35" style={{ borderRadius: '30% 70% 40% 60%' }}></div>
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-teal-200 to-cyan-300 top-3/4 left-2/3 opacity-30" style={{ borderRadius: '60% 40% 30% 70%' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <FeaturesSection />
        </div>
      </section>

      {/* CTA Section - Full Screen */}
      <section className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center pt-16 md:pt-0">
        {/* Decorative blobs */}
        <div className="absolute w-38 h-38 rounded-full bg-gradient-to-br from-orange-200 to-red-300 top-20 left-20 opacity-40" style={{ borderRadius: '70% 30% 60% 40%' }}></div>
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-sky-200 to-blue-300 bottom-24 right-16 opacity-35" style={{ borderRadius: '40% 60% 30% 70%' }}></div>
        <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-lime-200 to-green-300 top-1/2 left-1/4 opacity-25" style={{ borderRadius: '50% 50% 70% 30%' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <CTASection />
        </div>
      </section>
    </div>
  );
};
