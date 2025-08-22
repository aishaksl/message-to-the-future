import React from "react";
import { BookOpenText } from 'lucide-react';
import { Video } from 'lucide-react';
import { AudioLines } from 'lucide-react';
import { Image } from 'lucide-react';
import { MailCheck } from 'lucide-react';
import { MessageCircleHeart } from 'lucide-react';
import { HeartPlus } from 'lucide-react';
import { CalendarHeart } from 'lucide-react';



const HowItWorksSection: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-600 leading-tight tracking-tight mb-6 md:mb-4">
          How It Works
        </h2>
        <p className="text-base md:text-xl text-slate-600 leading-relaxed font-light">
          Create your message in just 5 simple steps
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 md:gap-4 max-w-7xl mx-auto">
        <div className="contents">
          {/* First 4 cards in normal grid flow */}
          {/* Step 1: Choose Recipient */}
          <div className="group bg-white rounded-xl px-3 pt-6 md:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 text-center relative overflow-hidden">
            {/* ... existing step 1 content ... */}
            <div className="h-16 md:h-32 relative mb-1 md:mb-3 flex items-center justify-center">
              <div className="relative z-10 w-24 h-24 bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="flex flex-col gap-2 items-center">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/30 border border-white/40 transition-all duration-300">
                    <div className="relative w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white/90 rounded-full"></div>
                    </div>
                    <div className="text-xs font-semibold text-slate-600">Myself</div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500 transition-all duration-300">
                    <div className="relative w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-red-400 border border-white/80">
                      <div className="absolute inset-0.5 border border-white/60 rounded-full"></div>
                    </div>
                    <div className="text-xs font-semibold text-indigo-600">Someone</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold mb-1 md:mb-2">1</div>
              <h3 className="text-lg  text-slate-800 mb-1 bg-gradient-to-br from-blue-300 to-purple-600  bg-clip-text text-transparent">Choose Recipient</h3>
              <p className="hidden md:block text-sm text-slate-600">Select who will receive your message: yourself or someone special</p>
            </div>
          </div>

          {/* Step 2: Choose Platform */}
          <div className="group bg-white rounded-xl px-3 pt-6 md:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 text-center relative overflow-hidden">
            <div className="h-16 md:h-32 relative mb-1 md:mb-3 flex items-center justify-center">
              <div className="relative z-10 w-24 h-24 bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="flex gap-3 items-center">
                  <MessageCircleHeart size={32} strokeWidth={1.25} color="#6366F1" />
                  <div className="rounded-lg bg-indigo-500/20 border border-indigo-500 flex items-center justify-center transition-all duration-300 transform scale-110 shadow-lg shadow-indigo-500/30">
                    <MailCheck size={32} strokeWidth={1.25} className="p-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold mb-1 md:mb-2">2</div>
              <h3 className="text-lg text-slate-800 mb-1 bg-gradient-to-br from-blue-300 to-purple-600 bg-clip-text text-transparent">Choose Platform</h3>
              <p className="hidden md:block text-sm text-slate-600">Select your preferred delivery method: Email or WhatsApp</p>
            </div>
          </div>

          {/* Step 3: Content Type */}
          <div className="group bg-white rounded-xl px-3 pt-6 md:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 text-center relative overflow-hidden">
            <div className="h-16 md:h-32 relative mb-1 md:mb-3 flex items-center justify-center">
              <div className="relative z-10 w-24 h-24 bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-indigo-500/20 border border-indigo-500 rounded-md flex items-center justify-center transition-all duration-300 transform scale-110 shadow-lg shadow-indigo-500/30">
                    <BookOpenText size={24} strokeWidth={1.25} className="p-1" />
                  </div>
                  <Video color="#6366F1" size={24} strokeWidth={1.25} />
                  <AudioLines color="#6366F1" size={24} strokeWidth={1.25} />
                  <Image color="#6366F1" size={24} strokeWidth={1.25} />
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold mb-1 md:mb-2">3</div>
              <h3 className="text-lg text-slate-800 mb-1 bg-gradient-to-br from-blue-300 to-purple-600 bg-clip-text text-transparent">Content Type</h3>
              <p className="hidden md:block text-sm text-slate-600">Choose the type of content: text, video, audio, or image</p>
            </div>
          </div>

          {/* Step 4: Add Content */}
          <div className="group bg-white rounded-xl px-3 pt-6 md:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 text-center relative overflow-hidden">
            <div className="h-16 md:h-32 relative mb-1 md:mb-3 flex items-center justify-center">
              <div className="relative z-10 w-24 h-24 bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-16 h-16 border-2 border-dashed border-indigo-500/50 rounded-xl bg-white/10 flex flex-col items-center justify-center gap-1">
                  <HeartPlus size={24} color="#6366F1" strokeWidth={1.80} />
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold mb-1 md:mb-2">4</div>
              <h3 className="text-lg text-slate-800 mb-1 bg-gradient-to-br from-blue-300 to-purple-600 bg-clip-text text-transparent">Add Content</h3>
              <p className="hidden md:block text-sm text-slate-600">Upload your files or write your message content</p>
            </div>
          </div>
        </div>

        {/* Step 5: Set Schedule */}
        <div className="group bg-white rounded-xl px-3 pt-6 md:p-6 shadow-lg border border-gray-100 hover:shadow-lg transition-all duration-300 text-center relative overflow-hidden">
          <div className="h-16 md:h-32 relative mb-1 md:mb-3 flex items-center justify-center">
            <div className="relative z-10 w-24 h-24 bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex flex-col items-center justify-center gap-1">
                <div className="text-xs text-indigo-600 ">2025</div>
                <CalendarHeart size={24} color="#6366F1" strokeWidth={1.25} />
                <div className="text-xs text-indigo-600 ">Dec 25</div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold mb-1 md:mb-2">5</div>
            <h3 className="text-lg text-slate-800 mb-1 bg-gradient-to-br from-blue-300 to-purple-600 bg-clip-text text-transparent">Set Schedule</h3>
            <p className="hidden md:block text-sm text-slate-600">Choose when your message should be delivered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;