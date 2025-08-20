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
      gradient: "from-purple-400 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      iconColor: "#8B5CF6"
    },
    {
      icon: Video,
      title: "Video Messages",
      description: "Record personal videos and visual stories",
      gradient: "from-blue-400 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50",
      iconColor: "#3B82F6"
    },
    {
      icon: AudioLines,
      title: "Voice Notes",
      description: "Share your voice and spoken emotions",
      gradient: "from-purple-400 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      iconColor: "#8B5CF6"
    }
  ];

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-600 leading-tight tracking-tight">
          Send Messages To The Future
          <span className="block text-4xl md:text-5xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-30 bg-clip-text text-transparent font-medium pb-1">
            In Four Ways
          </span>
        </h2>
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
          Send your message not just one way, but in multiple ways: text, image, video, or audio. All together, in a single message.        </p>
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

              <div className="relative bg-white/80 backdrop-blur-sm border border-white/30 rounded-3xl p-8 text-center transition-all duration-500 ease-out group-hover:bg-white/95 group-hover:translate-y-[-4px] group-hover:border-white/50">
                <div className="relative mb-6 flex items-center justify-center">
                  <div className={`absolute w-20 h-20 rounded-full bg-gradient-to-br ${type.gradient} opacity-10 group-hover:opacity-20 transition-all duration-500 group-hover:scale-110`}></div>

                  <div className="relative z-10 w-16 h-16 bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-md transition-all duration-500 group-hover:scale-105">
                    <IconComponent
                      size={32}
                      strokeWidth={1.5}
                      color={type.iconColor}
                      className="transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3
                    className={`text-xl font-light mb-3 transition-all duration-300
                      ${type.title === "Text Messages" || type.title === "Video Messages"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-700 bg-clip-text text-transparent opacity-50"
                        : "bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-700"
                      }`}
                  >
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
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default ContentTypesSection;
