import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Domain, Topic, ContentPiece } from '../types';

interface KnowledgeMapBlueprintProps {
  domains: Domain[];
  onContentSelect: (content: ContentPiece, topic: Topic, domain: Domain) => void;
  searchQuery: string;
}

export function KnowledgeMapBlueprint({ domains, onContentSelect, searchQuery }: KnowledgeMapBlueprintProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [gridOpacity, setGridOpacity] = useState(1);

  const getContentIcon = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return '📋'; // Technical specs
      case 'podcast': return '📻'; // Communication device
      case 'video': return '📺'; // Display screen
      case 'guide': return '📐'; // Measurement tool
    }
  };

  const getArchitecturalElement = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return 'SPEC';
      case 'podcast': return 'COMM';
      case 'video': return 'DISP';
      case 'guide': return 'TOOL';
    }
  };

  const getRoomType = (topicTitle: string) => {
    const types = ['CONF', 'LAB', 'WORK', 'ARCH'];
    return types[Math.abs(topicTitle.charCodeAt(0)) % types.length];
  };

  // Filter content based on search query
  const filteredDomains = domains.map(domain => ({
    ...domain,
    topics: domain.topics.map(topic => ({
      ...topic,
      content: topic.content.filter(content =>
        searchQuery === '' ||
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })).filter(topic => topic.content.length > 0 || searchQuery === '')
  })).filter(domain => domain.topics.length > 0 || searchQuery === '');

  const resetView = () => {
    setSelectedDomain(null);
    setSelectedTopic(null);
  };

  // Building Overview (Main View)
  if (!selectedDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        {/* Blueprint Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Technical Border Frame */}
        <div className="absolute inset-4 border-2 border-white/30 pointer-events-none">
          <div className="absolute -top-6 left-0 bg-blue-900 px-4 text-white text-sm font-mono">
            DIGITAL TWINS KNOWLEDGE BUILDING - ELEVATION VIEW
          </div>
          <div className="absolute -bottom-6 right-0 bg-blue-900 px-4 text-white text-sm font-mono">
            SCALE 1:1 | REV 2.1 | {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Title */}
        <div className="relative z-10 pt-12 pb-8 text-center">
          <motion.h1 
            className="text-5xl font-mono text-white mb-4 tracking-wider"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            KNOWLEDGE TOWER
          </motion.h1>
          <motion.p 
            className="text-xl text-blue-100 font-mono tracking-wide"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            ARCHITECTURAL BLUEPRINT FOR DIGITAL TWIN EXPERTISE
          </motion.p>
        </div>

        {/* Building Elevation - Isometric View */}
        <div className="relative max-w-6xl mx-auto px-8">
          <div className="relative" style={{ height: '600px' }}>
            {/* Building Base */}
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <svg width="600" height="100" className="text-white/20">
                <rect x="50" y="20" width="500" height="60" fill="none" stroke="currentColor" strokeWidth="2" />
                <text x="300" y="55" textAnchor="middle" className="fill-white/60 text-sm font-mono">
                  FOUNDATION LEVEL
                </text>
              </svg>
            </motion.div>

            {/* Domain Floors */}
            {filteredDomains.map((domain, index) => {
              const floorHeight = 120;
              const floorY = 500 - (index + 1) * floorHeight;
              
              return (
                <motion.div
                  key={domain.id}
                  className="absolute left-1/2 transform -translate-x-1/2"
                  style={{ top: floorY }}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.3 }}
                >
                  <motion.div
                    className="relative cursor-pointer group"
                    whileHover={{ scale: 1.02, z: 10 }}
                    onClick={() => setSelectedDomain(domain.id)}
                    onHoverStart={() => setHoveredElement(domain.id)}
                    onHoverEnd={() => setHoveredElement(null)}
                  >
                    {/* Floor Structure */}
                    <svg width="600" height="100" className="text-white/80">
                      {/* Main floor outline */}
                      <rect 
                        x="50" y="10" width="500" height="80" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        className={hoveredElement === domain.id ? "stroke-white" : ""}
                      />
                      
                      {/* Floor divisions for topics */}
                      {domain.topics.map((_, topicIndex) => (
                        <g key={topicIndex}>
                          <line 
                            x1={150 + topicIndex * 100} y1="10" 
                            x2={150 + topicIndex * 100} y2="90" 
                            stroke="currentColor" 
                            strokeWidth="1" 
                            opacity="0.5"
                          />
                        </g>
                      ))}
                      
                      {/* Floor Label */}
                      <text 
                        x="25" y="55" 
                        className="fill-white font-mono text-sm" 
                        textAnchor="middle"
                        transform="rotate(-90, 25, 55)"
                      >
                        FLOOR {filteredDomains.length - index}
                      </text>
                      
                      {/* Domain Icon */}
                      <foreignObject x="60" y="25" width="40" height="40">
                        <div 
                          className={`w-10 h-10 ${domain.color} rounded flex items-center justify-center text-xl`}
                        >
                          {domain.icon}
                        </div>
                      </foreignObject>
                      
                      {/* Domain Title */}
                      <text 
                        x="120" y="35" 
                        className="fill-white font-mono text-sm font-bold"
                      >
                        {domain.title.toUpperCase()}
                      </text>
                      
                      {/* Room Count */}
                      <text 
                        x="120" y="55" 
                        className="fill-white/70 font-mono text-xs"
                      >
                        {domain.topics.length} ROOMS | {domain.topics.reduce((acc, topic) => acc + topic.content.length, 0)} ELEMENTS
                      </text>
                      
                      {/* Technical annotations */}
                      <text 
                        x="570" y="25" 
                        className="fill-white/50 font-mono text-xs"
                      >
                        AREA: {domain.topics.length * 250}m²
                      </text>
                      <text 
                        x="570" y="40" 
                        className="fill-white/50 font-mono text-xs"
                      >
                        HEIGHT: 3.5m
                      </text>
                      <text 
                        x="570" y="55" 
                        className="fill-white/50 font-mono text-xs"
                      >
                        CAPACITY: {domain.topics.reduce((acc, topic) => acc + topic.content.length, 0)} USERS
                      </text>
                    </svg>

                    {/* Hover Effect Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-white/5 rounded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredElement === domain.id ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Building Top */}
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <svg width="600" height="80" className="text-white/40">
                <polygon points="50,60 300,10 550,60 300,80" fill="none" stroke="currentColor" strokeWidth="2" />
                <text x="300" y="50" textAnchor="middle" className="fill-white/60 text-sm font-mono">
                  DIGITAL TWINS HUB
                </text>
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Legend - Technical Specifications */}
        <motion.div 
          className="fixed bottom-6 left-6 bg-blue-900/90 backdrop-blur-sm border border-white/30 rounded p-4 text-white font-mono"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
        >
          <h3 className="font-bold mb-3 text-sm">ELEMENT LEGEND</h3>
          <div className="grid gap-2 text-xs">
            {[
              { type: 'wiki', symbol: '📋', code: 'SPEC', label: 'Technical Specifications' },
              { type: 'podcast', symbol: '📻', code: 'COMM', label: 'Communication Systems' },
              { type: 'video', symbol: '📺', code: 'DISP', label: 'Display Technology' },
              { type: 'guide', symbol: '📐', code: 'TOOL', label: 'Measurement Tools' },
            ].map(({ type, symbol, code, label }) => (
              <div key={type} className="flex items-center gap-3">
                <span className="w-6 text-center">{symbol}</span>
                <span className="w-10">{code}</span>
                <span className="opacity-70">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Instructions */}
        <motion.div 
          className="fixed bottom-6 right-6 bg-blue-900/90 backdrop-blur-sm border border-white/30 rounded p-4 text-white font-mono max-w-xs"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.2 }}
        >
          <h3 className="font-bold mb-2 text-sm">NAVIGATION</h3>
          <p className="text-xs opacity-70">
            Click on any floor to access the detailed floor plan and explore individual rooms and their architectural elements.
          </p>
        </motion.div>
      </div>
    );
  }

  // Floor Plan View (Domain Selected)
  if (selectedDomain && !selectedTopic) {
    const domain = filteredDomains.find(d => d.id === selectedDomain)!;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        {/* Blueprint Grid */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Technical Frame */}
        <div className="absolute inset-4 border-2 border-white/30 pointer-events-none">
          <div className="absolute -top-6 left-0 bg-blue-900 px-4 text-white text-sm font-mono">
            {domain.title.toUpperCase()} - FLOOR PLAN VIEW
          </div>
          <div className="absolute -bottom-6 right-0 bg-blue-900 px-4 text-white text-sm font-mono">
            SCALE 1:100 | GRID 20mm
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="pt-8 pb-6 px-8 flex items-center gap-2 text-sm text-blue-200 font-mono relative z-10">
          <motion.button 
            onClick={resetView} 
            className="hover:text-white transition-colors flex items-center gap-1"
            whileHover={{ x: -2 }}
          >
            ← BUILDING VIEW
          </motion.button>
          <span>/</span>
          <span className="text-white font-semibold">FLOOR {filteredDomains.findIndex(d => d.id === selectedDomain) + 1}</span>
        </div>

        {/* Floor Plan */}
        <div className="relative max-w-7xl mx-auto px-8">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div 
                className={`w-16 h-16 ${domain.color} rounded flex items-center justify-center text-3xl border-2 border-white/50`}
              >
                {domain.icon}
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-mono text-white tracking-wider">{domain.title.toUpperCase()}</h1>
                <p className="text-blue-200 font-mono">{domain.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Room Layout */}
          <div className="relative bg-blue-800/30 border-2 border-white/30 rounded-lg p-8" style={{ minHeight: '500px' }}>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-8 h-full">
              {domain.topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  className="relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <motion.div
                    className="h-full border-2 border-white/50 bg-blue-700/20 cursor-pointer group relative overflow-hidden"
                    whileHover={{ 
                      borderColor: 'rgba(255,255,255,0.8)',
                      backgroundColor: 'rgba(255,255,255,0.1)' 
                    }}
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    {/* Room Structure */}
                    <div className="p-6 h-full flex flex-col">
                      {/* Room Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-white/20 text-white text-xs font-mono rounded">
                              {getRoomType(topic.title)}
                            </span>
                            <span className="text-white/60 text-xs font-mono">
                              ROOM {index + 1}
                            </span>
                          </div>
                          <h3 className="text-lg font-mono text-white mb-1">{topic.title}</h3>
                          <p className="text-blue-200 text-sm font-mono">{topic.description}</p>
                        </div>
                      </div>

                      {/* Room Elements Grid */}
                      <div className="flex-1 grid grid-cols-2 gap-3 mb-4">
                        {['wiki', 'podcast', 'video', 'guide'].map((type) => {
                          const content = topic.content.find(c => c.type === type);
                          return (
                            <div 
                              key={type}
                              className={`border border-white/30 p-3 text-center transition-all ${
                                content 
                                  ? 'bg-white/10 hover:bg-white/20' 
                                  : 'bg-gray-500/20 opacity-50'
                              }`}
                            >
                              <div className="text-lg mb-1">{getContentIcon(type as ContentPiece['type'])}</div>
                              <div className="text-xs font-mono text-white mb-1">
                                {getArchitecturalElement(type as ContentPiece['type'])}
                              </div>
                              {content && (
                                <div className="text-xs text-blue-200 font-mono truncate">
                                  {content.title}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Room Specifications */}
                      <div className="border-t border-white/30 pt-3">
                        <div className="flex justify-between text-xs font-mono text-white/70">
                          <span>AREA: {topic.content.length * 12}m²</span>
                          <span>ELEMENTS: {topic.content.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dimension Lines */}
                    <svg className="absolute inset-0 pointer-events-none opacity-30">
                      <line x1="0" y1="20" x2="100%" y2="20" stroke="white" strokeWidth="1" />
                      <line x1="20" y1="0" x2="20" y2="100%" stroke="white" strokeWidth="1" />
                    </svg>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Floor Dimensions */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs font-mono text-white/50">
              <span>0.00</span>
              <span>TOTAL FLOOR AREA: {domain.topics.length * 48}m²</span>
              <span>{domain.topics.length * 6}.00m</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Room Detail View (Topic Selected)
  if (selectedDomain && selectedTopic) {
    const domain = filteredDomains.find(d => d.id === selectedDomain)!;
    const topic = domain.topics.find(t => t.id === selectedTopic)!;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        {/* Fine Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px'
          }}
        />

        {/* Breadcrumb */}
        <div className="pt-8 pb-6 px-8 flex items-center gap-2 text-sm text-blue-200 font-mono relative z-10">
          <motion.button 
            onClick={resetView} 
            className="hover:text-white transition-colors"
            whileHover={{ x: -2 }}
          >
            ← BUILDING
          </motion.button>
          <span>/</span>
          <motion.button 
            onClick={() => setSelectedTopic(null)} 
            className="hover:text-white transition-colors"
            whileHover={{ x: -2 }}
          >
            FLOOR {filteredDomains.findIndex(d => d.id === selectedDomain) + 1}
          </motion.button>
          <span>/</span>
          <span className="text-white font-semibold">ROOM DETAIL</span>
        </div>

        {/* Room Detail Header */}
        <motion.div 
          className="text-center mb-8 px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-mono text-white mb-2">{topic.title.toUpperCase()}</h1>
          <p className="text-xl text-blue-200 font-mono mb-4">{topic.description}</p>
          <Badge variant="outline" className="text-blue-200 border-blue-200/50 font-mono">
            {getRoomType(topic.title)} | {topic.content.length} ELEMENTS
          </Badge>
        </motion.div>

        {/* Technical Drawing Layout */}
        <div className="relative max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {topic.content.map((content, index) => (
              <motion.div
                key={content.id}
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 }}
              >
                <motion.div
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => onContentSelect(content, topic, domain)}
                >
                  <Card className="bg-blue-800/30 border-white/30 hover:bg-blue-700/40 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      {/* Technical Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center text-xl border border-white/30">
                            {getContentIcon(content.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-1 bg-white/30 text-white text-xs font-mono rounded">
                                {getArchitecturalElement(content.type)}
                              </span>
                              <Badge variant="outline" className="text-blue-200 border-blue-200/50 text-xs font-mono">
                                {content.type.toUpperCase()}
                              </Badge>
                            </div>
                            <h3 className="font-mono text-white">{content.title}</h3>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-blue-200 text-sm mb-4 font-mono">{content.description}</p>
                      
                      {/* Technical Specifications */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-mono">
                        <div className="text-white/70">
                          <div>AUTHOR: {content.author}</div>
                          <div>DATE: {content.publishedAt}</div>
                        </div>
                        <div className="text-white/70">
                          <div>DURATION: {content.readTime || content.duration}</div>
                          <div>REV: 1.0</div>
                        </div>
                      </div>
                      
                      {/* Tags as Material Specs */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {content.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-blue-200 border-blue-200/30 text-xs font-mono">
                            {tag.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 font-mono"
                        size="sm"
                      >
                        {content.type === 'wiki' || content.type === 'guide' ? 'REVIEW SPECS' : 
                         content.type === 'podcast' ? 'PLAY AUDIO' : 'VIEW DISPLAY'} →
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Technical Annotation Lines */}
                {index % 2 === 0 && (
                  <svg className="absolute -right-4 top-1/2 w-8 h-1 pointer-events-none opacity-30">
                    <line x1="0" y1="0" x2="32" y2="0" stroke="white" strokeWidth="1" />
                    <circle cx="32" cy="0" r="2" fill="white" />
                  </svg>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (searchQuery && filteredDomains.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-24 h-24 bg-white/10 border-2 border-white/30 rounded flex items-center justify-center mx-auto mb-6 text-4xl font-mono">
            🔍
          </div>
          <h3 className="text-2xl font-mono text-white mb-4">NO BLUEPRINTS FOUND</h3>
          <p className="text-blue-200 max-w-md mx-auto font-mono">
            Your search didn't match any floors, rooms, or elements. Try different keywords or explore the building.
          </p>
          <motion.button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-white/20 text-white border border-white/30 rounded hover:bg-white/30 transition-colors font-mono"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RETURN TO BUILDING
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return null;
}