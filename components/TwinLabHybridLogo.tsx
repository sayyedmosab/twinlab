interface TwinLabHybridLogoProps {
  className?: string;
  size?: number;
}

export function TwinLabHybridLogo({ className = "", size = 120 }: TwinLabHybridLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Digital Side - Left Half - Circuit/Neural Network Pattern */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 120 120" 
        className="absolute inset-0"
      >
        {/* Digital Side Background */}
        <defs>
          <linearGradient id="digitalGradient" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="organicGradient" x1="50%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        
        {/* Digital Half - Left Side */}
        <path 
          d="M 60 10 A 50 50 0 0 0 60 110 Z" 
          fill="url(#digitalGradient)"
          className="opacity-90"
        />
        
        {/* Organic Half - Right Side */}
        <path 
          d="M 60 10 A 50 50 0 0 1 60 110 Z" 
          fill="url(#organicGradient)"
          className="opacity-90"
        />
        
        {/* Central Fusion Line with Glow */}
        <line 
          x1="60" y1="10" x2="60" y2="110" 
          stroke="#ffffff" 
          strokeWidth="1" 
          className="opacity-80"
        />
        
        {/* Digital Circuit Pattern - Left Side */}
        <g className="opacity-70">
          {/* Main Circuit Lines */}
          <path d="M 20 30 L 50 30 L 50 45 L 35 45" stroke="#ffffff" strokeWidth="1.5" fill="none" />
          <path d="M 25 50 L 45 50 L 45 65 L 30 65" stroke="#ffffff" strokeWidth="1.5" fill="none" />
          <path d="M 15 75 L 55 75 L 55 85 L 40 85" stroke="#ffffff" strokeWidth="1.5" fill="none" />
          
          {/* Circuit Nodes */}
          <circle cx="20" cy="30" r="2" fill="#ffffff" />
          <circle cx="35" cy="45" r="2" fill="#ffffff" />
          <circle cx="25" cy="50" r="2" fill="#ffffff" />
          <circle cx="30" cy="65" r="2" fill="#ffffff" />
          <circle cx="15" cy="75" r="2" fill="#ffffff" />
          <circle cx="40" cy="85" r="2" fill="#ffffff" />
          
          {/* Data Flow Indicators */}
          <rect x="32" y="27" width="4" height="6" fill="#00ffff" className="animate-pulse" />
          <rect x="27" y="47" width="4" height="6" fill="#00ffff" className="animate-pulse" />
          <rect x="37" y="72" width="4" height="6" fill="#00ffff" className="animate-pulse" />
        </g>
        
        {/* Organic Neural Pattern - Right Side */}
        <g className="opacity-70">
          {/* Organic Neural Branches */}
          <path 
            d="M 70 25 Q 85 30 80 45 Q 75 60 90 55 Q 105 50 100 70 Q 95 85 85 90" 
            stroke="#ffffff" 
            strokeWidth="1.5" 
            fill="none"
          />
          <path 
            d="M 75 35 Q 90 40 85 55 Q 80 70 95 65" 
            stroke="#ffffff" 
            strokeWidth="1.5" 
            fill="none"
          />
          <path 
            d="M 65 60 Q 80 65 75 80 Q 70 95 85 90" 
            stroke="#ffffff" 
            strokeWidth="1.5" 
            fill="none"
          />
          
          {/* Neural Nodes */}
          <circle cx="70" cy="25" r="2.5" fill="#ffffff" />
          <circle cx="80" cy="45" r="2.5" fill="#ffffff" />
          <circle cx="90" cy="55" r="2.5" fill="#ffffff" />
          <circle cx="100" cy="70" r="2.5" fill="#ffffff" />
          <circle cx="85" cy="90" r="2.5" fill="#ffffff" />
          <circle cx="75" cy="35" r="2" fill="#ffffff" />
          <circle cx="85" cy="55" r="2" fill="#ffffff" />
          <circle cx="95" cy="65" r="2" fill="#ffffff" />
          <circle cx="65" cy="60" r="2" fill="#ffffff" />
          <circle cx="75" cy="80" r="2" fill="#ffffff" />
          
          {/* Organic Pulse Indicators */}
          <circle cx="80" cy="45" r="4" fill="#00ff88" className="animate-ping opacity-75" />
          <circle cx="90" cy="55" r="4" fill="#00ff88" className="animate-ping opacity-75" />
          <circle cx="75" cy="80" r="4" fill="#00ff88" className="animate-ping opacity-75" />
        </g>
        
        {/* Central Fusion Core */}
        <circle 
          cx="60" 
          cy="60" 
          r="8" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="2"
          className="opacity-90"
        />
        <circle 
          cx="60" 
          cy="60" 
          r="4" 
          fill="#ffffff"
          className="animate-pulse opacity-80"
        />
        
        {/* Outer Ring */}
        <circle 
          cx="60" 
          cy="60" 
          r="50" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="1.5"
          strokeDasharray="5,5"
          className="opacity-40 animate-spin"
          style={{ animationDuration: '20s' }}
        />
      </svg>
      
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 rounded-full blur-md opacity-30"
        style={{
          background: `radial-gradient(circle, #0ea5e9 0%, #10b981 50%, transparent 70%)`
        }}
      />
    </div>
  );
}