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
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-4">
          How It Works
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Create your message in just 5 simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {/* Step 1: Choose Recipient */}
        <div className="group bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-6 text-center relative overflow-hidden transition-all duration-500 ease-out hover:translate-y-[-8px] hover:shadow-2xl hover:bg-white">
          {/* ... existing step 1 content ... */}
          <div className="h-32 relative mb-3 flex items-center justify-center">
            <div className="absolute w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 top-4 left-4 opacity-60" style={{ borderRadius: '50% 30% 70% 40%' }}></div>
            <div className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 bottom-6 right-3 opacity-60" style={{ borderRadius: '50% 30% 70% 40%' }}></div>

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
            <div className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold mb-2">1</div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">Choose Recipient</h3>
            <p className="text-sm text-slate-600">Select who will receive your message: yourself or someone special</p>
          </div>
        </div>

        {/* Step 2: Choose Platform */}
        <div className="group bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-6 text-center relative overflow-hidden transition-all duration-500 ease-out hover:translate-y-[-8px] hover:shadow-2xl hover:bg-white">
          <div className="h-32 relative mb-3 flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 top-5 left-6 opacity-60" style={{ borderRadius: '50% 30% 70% 40%' }}></div>
            <div className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 bottom-4 right-3 opacity-60" style={{ borderRadius: '50% 30% 70% 40%' }}></div>

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
            <div className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold mb-2">2</div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">Choose Platform</h3>
            <p className="text-sm text-slate-600">Select your preferred delivery method: Email or WhatsApp</p>
          </div>
        </div>

        {/* Step 3: Content Type */}
        <div className="group bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-6 text-center relative overflow-hidden transition-all duration-500 ease-out hover:translate-y-[-8px] hover:shadow-2xl hover:bg-white">
          <div className="h-32 relative mb-3 flex items-center justify-center">
            <div className="absolute w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 top-5 right-2 opacity-60" style={{ borderRadius: '50% 30% 70% 40%' }}></div>
            <div className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 bottom-7 left-4 opacity-60" style={{ borderRadius: '50% 30% 70% 40%' }}></div>

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
            <div className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold mb-2">3</div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">Content Type</h3>
            <p className="text-sm text-slate-600">Choose the type of content: text, video, audio, or image</p>
          </div>
        </div>

        {/* Step 4: Add Content */}
        <div className="group bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-6 text-center relative overflow-hidden transition-all duration-500 ease-out hover:translate-y-[-8px] hover:shadow-2xl hover:bg-white">
          <div className="h-32 relative mb-3 flex items-center justify-center">
            <div className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-yellow-300 top-6 left-5 opacity-60" style={{ borderRadius: '50% 30% 70% 40%' }}></div>
            <div className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-cyan-300 bottom-8 right-6 opacity-60" style={{ borderRadius: '50% 30% 70% 40%' }}></div>

            <div className="relative z-10 w-24 h-24 bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 border-2 border-dashed border-indigo-500/50 rounded-xl bg-white/10 flex flex-col items-center justify-center gap-1">
                <HeartPlus size={24} color="#6366F1" strokeWidth={1.80} />
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold mb-2">4</div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">Add Content</h3>
            <p className="text-sm text-slate-600">Upload your files or write your message content</p>
          </div>
        </div>

        {/* Step 5: Set Schedule */}
        <div className="group bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-6 text-center relative overflow-hidden transition-all duration-500 ease-out hover:translate-y-[-8px] hover:shadow-2xl hover:bg-white">
          <div className="h-32 relative mb-3 flex items-center justify-center">
            <div className="absolute w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-teal-400 top-4 right-4 opacity-60" style={{ borderRadius: '50% 30% 70% 40%' }}></div>
            <div className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-pink-400 bottom-5 left-3 opacity-60" style={{ borderRadius: '50% 30% 70% 40%' }}></div>

            <div className="relative z-10 w-24 h-24 bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex flex-col items-center justify-center gap-1">
                <div className="text-xs text-indigo-600 font-bold">2025</div>
                <CalendarHeart size={24} color="#6366F1" strokeWidth={1.80} />
                <div className="text-xs text-indigo-600 font-bold">Dec 25</div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold mb-2">5</div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">Set Schedule</h3>
            <p className="text-sm text-slate-600">Choose when your message should be delivered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;