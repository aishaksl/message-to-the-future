import { Clock, Layers, Shield } from "lucide-react";

export const FeaturesSection: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="text-center mb-8 md:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-600 leading-tight tracking-tight mb-6 md:mb-4">
          Why Choose Our Platform
        </h2>
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
          Trusted by thousands to deliver their most precious messages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-8 text-center hover:bg-white hover:shadow-xl transition-all duration-300 group">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 mb-4">Perfect Timing</h3>
          <p className="text-slate-600 leading-relaxed">
            Deliver your messages from tomorrow to decades ahead, exactly when they're needed most
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-8 text-center hover:bg-white hover:shadow-xl transition-all duration-300 group">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <Layers className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 mb-4">Rich Content</h3>
          <p className="text-slate-600 leading-relaxed">
            Combine voice recordings, photos, videos, and heartfelt words in one beautiful message
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-8 text-center hover:bg-white hover:shadow-xl transition-all duration-300 group">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-medium text-slate-800 mb-4">Secure & Reliable</h3>
          <p className="text-slate-600 leading-relaxed">
            Your precious thoughts are encrypted and safely stored until the perfect moment
          </p>
        </div>
      </div>
    </div>
  );
};
