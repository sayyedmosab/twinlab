import { motion } from 'motion/react';

interface HeaderProps {
  currentUser: any;
  onLoginClick: () => void;
  onBackToLanding?: () => void;
  showBackButton?: boolean;
}

export function Header({ currentUser, onLoginClick, onBackToLanding, showBackButton = false }: HeaderProps) {

  return (
    <header className="sticky top-0 z-50 h-16 bg-gradient-to-r from-stone-500 via-stone-400 to-stone-500 relative">
      {/* Rusty Silver Frame with Panel Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-600/80 to-stone-400/80">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        
        {/* Panel Bolts */}
        <div className="absolute top-2 left-4 w-1 h-1 bg-cyan-400 rounded-full"></div>
        <div className="absolute top-2 right-4 w-1 h-1 bg-cyan-400 rounded-full"></div>
        <div className="absolute bottom-2 left-4 w-1 h-1 bg-cyan-400 rounded-full"></div>
        <div className="absolute bottom-2 right-4 w-1 h-1 bg-cyan-400 rounded-full"></div>
        
        {/* Neon Light Tracks */}
        <motion.div
          className="absolute left-2 top-0 w-0.5 h-4 bg-gradient-to-b from-cyan-400 to-transparent"
          animate={{ y: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute right-2 top-0 w-0.5 h-4 bg-gradient-to-b from-cyan-400 to-transparent"
          animate={{ y: ['100%', '0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative h-full px-8">
        <div className="flex items-center justify-between h-full">
          {/* TwinLab Title */}
          <div className="flex items-center gap-6">
            {showBackButton && onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border border-cyan-400/30 transition-colors font-inter text-sm"
              >
                ← Back to Universe
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white font-allerta" style={{ 
                textShadow: '0 0 15px rgba(173, 216, 230, 0.8), 0 0 30px rgba(173, 216, 230, 0.6)' 
              }}>
                TWINLAB
              </h1>
              <p className="text-sm text-cyan-300 font-inter -mt-1">The Future, Ready Today</p>
            </div>
          </div>

          {/* Right Side - Learn, Share, Grow & User */}
          <div className="flex items-center gap-6">
            <div className="text-xl font-bold text-cyan-300 font-inter">
              Learn, Share, Grow
            </div>
            
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center border border-cyan-400/30">
                  <span className="text-white text-sm">👤</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white font-inter">{currentUser.name}</p>
                  <p className="text-xs text-gray-300 capitalize font-inter">{currentUser.role}</p>
                </div>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white border border-cyan-400/30 transition-colors font-inter text-sm"
              >
                🔑 LOGIN
              </button>
            )}
          </div>
        </div>
        
        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
      </div>
    </header>
  );
}