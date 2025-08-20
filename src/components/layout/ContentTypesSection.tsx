import React from "react";
import { BookOpenText, Video, AudioLines, Image } from 'lucide-react';

const ContentTypesSection: React.FC = () => {
  const contentTypes = [
    {
      icon: BookOpenText,
      title: "Text Messages",
      description: "Write heartfelt letters and meaningful words",
      gradient: "from-blue-400 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50",
      iconColor: "#3B82F6"
    },
    {
      icon: Image,
      title: "Photos & Images",
      description: "Capture precious moments and memories",
      gradient: "from-green-400 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      iconColor: "#10B981"
    },
    {
      icon: Video,
      title: "Video Messages",
      description: "Record personal videos and visual stories",
      gradient: "from-purple-400 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      iconColor: "#8B5CF6"
    },
    {
      icon: AudioLines,
      title: "Voice Notes",
      description: "Share your voice and spoken emotions",
      gradient: "from-orange-400 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      iconColor: "#F97316"
    }
  ];

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-6">
          Express Yourself in
          <span className="block bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-medium">
            Four Beautiful Ways
          </span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Combine multiple content types to create rich, meaningful messages that truly capture your thoughts and emotions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {contentTypes.map((type, index) => {
          const IconComponent = type.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${type.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out`}></div>
              
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-white/60 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
              <div className="absolute bottom-6 left-4 w-2 h-2 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
              
              <div className="relative bg-white/80 backdrop-blur-sm border border-white/30 rounded-3xl p-8 text-center transition-all duration-500 ease-out group-hover:bg-white/95 group-hover:shadow-2xl group-hover:translate-y-[-4px] group-hover:border-white/50">
                <div className="relative mb-6 flex items-center justify-center">
                  <div className={`absolute w-20 h-20 rounded-full bg-gradient-to-br ${type.gradient} opacity-10 group-hover:opacity-20 transition-all duration-500 group-hover:scale-110`}></div>
                  
                  <div className="relative z-10 w-16 h-16 bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
                    <IconComponent 
                      size={32} 
                      strokeWidth={1.5} 
                      color={type.iconColor}
                      className="transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${type.gradient} opacity-60 group-hover:opacity-100 transition-all duration-300`}></div>
                  <div className={`absolute bottom-2 left-2 w-1 h-1 rounded-full bg-gradient-to-br ${type.gradient} opacity-40 group-hover:opacity-80 transition-all duration-300 delay-100`}></div>
                </div>

                <div className="relative z-10">
                  <h3 className={`text-xl font-semibold text-slate-800 mb-3 group-hover:bg-gradient-to-br group-hover:${type.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                    {type.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {type.description}
                  </p>
                </div>

                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r ${type.gradient} opacity-0 group-hover:opacity-60 transition-all duration-500 delay-200`}></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-16">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-md border border-white/30 rounded-full">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 animate-pulse"></div>
          <p className="text-sm text-slate-600 font-medium">Mix and match to create your perfect message</p>
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default ContentTypesSection;
