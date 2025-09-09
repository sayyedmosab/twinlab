import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Domain, Topic, ContentPiece } from '../types';

interface KnowledgeMapProps {
  domains: Domain[];
  onContentSelect: (content: ContentPiece, topic: Topic, domain: Domain) => void;
  searchQuery: string;
}

export function KnowledgeMap({ domains, onContentSelect, searchQuery }: KnowledgeMapProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const getContentIcon = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return '📄';
      case 'podcast': return '🎧';
      case 'video': return '📺';
      case 'guide': return '📖';
    }
  };

  const getContentColor = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return '#3B82F6';
      case 'podcast': return '#10B981';
      case 'video': return '#EF4444';
      case 'guide': return '#8B5CF6';
    }
  };

  // Generate orbital positions for content pieces around topics
  const getContentTypePattern = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return 'wiki-pattern';
      case 'podcast': return 'podcast-pattern';
      case 'video': return 'video-pattern';
      case 'guide': return 'guide-pattern';
    }
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

  // Constellation View (Main View)
  if (!selectedDomain) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
        {/* Gentle stars background */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="relative z-10 mb-12">
          <motion.h1 
            className="text-5xl font-bold text-white mb-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Digital Twins Knowledge Constellation
          </motion.h1>
          <motion.p 
            className="text-xl text-blue-200 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Explore interconnected domains of knowledge. Each constellation represents a domain with its topics and content.
          </motion.p>
        </div>

        {/* Domain Constellation Grid */}
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-16 lg:gap-24">
            {filteredDomains.map((domain, domainIndex) => (
              <motion.div
                key={domain.id}
                className="relative flex flex-col items-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: domainIndex * 0.3, duration: 0.8 }}
              >
                {/* Domain Core */}
                <motion.div
                  className="relative cursor-pointer mb-8"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedDomain(domain.id)}
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4 + domainIndex,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div 
                    className={`w-24 h-24 rounded-full ${domain.color} flex items-center justify-center text-4xl shadow-2xl border-4 border-white/30`}
                    style={{
                      boxShadow: `0 0 60px ${domain.color.includes('blue') ? '#3B82F6' : 
                                            domain.color.includes('green') ? '#10B981' : 
                                            domain.color.includes('red') ? '#EF4444' : '#8B5CF6'}60`,
                    }}
                  >
                    {domain.icon}
                  </div>
                  
                  {/* Domain Info */}
                  <div className="text-center mt-4">
                    <h2 className="text-xl font-bold text-white mb-1">{domain.title}</h2>
                    <p className="text-blue-200 text-sm mb-2">{domain.description}</p>
                    <Badge variant="outline" className="text-blue-200 border-blue-200/50">
                      {domain.topics.length} topics • {domain.topics.reduce((acc, topic) => acc + topic.content.length, 0)} resources
                    </Badge>
                  </div>
                </motion.div>

                {/* Topic Stars arranged in a constellation pattern */}
                <div className="relative w-80 h-80">
                  {domain.topics.map((topic, topicIndex) => {
                    // Create constellation pattern positions
                    const positions = [
                      { x: 40, y: 20 },   // top-left
                      { x: 240, y: 30 },  // top-right  
                      { x: 60, y: 180 },  // bottom-left
                      { x: 220, y: 160 }, // bottom-right
                    ];
                    
                    const position = positions[topicIndex] || { x: 140, y: 90 };

                    return (
                      <motion.div
                        key={topic.id}
                        className="absolute"
                        style={{
                          left: position.x,
                          top: position.y,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1,
                          y: [0, -4, 0],
                        }}
                        transition={{ 
                          delay: domainIndex * 0.3 + topicIndex * 0.2,
                          y: {
                            duration: 3 + topicIndex,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                        }}
                      >
                        <motion.div
                          className="relative cursor-pointer group"
                          whileHover={{ scale: 1.2 }}
                        >
                          {/* Topic Star */}
                          <div
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white/80"
                            style={{
                              boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            <span className="text-xs">⭐</span>
                          </div>
                          
                          {/* Topic Info Card */}
                          <motion.div
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
                            initial={false}
                          >
                            <div className="bg-black/90 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap min-w-max">
                              <p className="font-semibold">{topic.title}</p>
                              <p className="text-xs text-gray-300 mt-1">{topic.content.length} resources</p>
                            </div>
                          </motion.div>

                          {/* Content satellites around topics */}
                          {topic.content.map((content, contentIndex) => {
                            const satellitePositions = [
                              { x: -20, y: -15 },
                              { x: 20, y: -15 },
                              { x: -20, y: 15 },
                              { x: 20, y: 15 },
                            ];
                            
                            const satPos = satellitePositions[contentIndex] || { x: 0, y: -20 };

                            return (
                              <motion.div
                                key={content.id}
                                className="absolute top-1/2 left-1/2"
                                style={{
                                  transform: `translate(${satPos.x - 3}px, ${satPos.y - 3}px)`,
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ 
                                  scale: 1, 
                                  opacity: 1,
                                  rotate: [0, 360],
                                }}
                                transition={{ 
                                  delay: domainIndex * 0.3 + topicIndex * 0.2 + contentIndex * 0.1,
                                  rotate: {
                                    duration: 20 + contentIndex * 5,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }
                                }}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full cursor-pointer ${getContentTypePattern(content.type)}`}
                                  style={{ 
                                    backgroundColor: getContentColor(content.type),
                                    boxShadow: `0 0 8px ${getContentColor(content.type)}`,
                                  }}
                                  title={`${content.title} (${content.type})`}
                                />
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </motion.div>
                    );
                  })}

                  {/* Constellation Connection Lines */}
                  <svg className="absolute inset-0 pointer-events-none opacity-30">
                    {domain.topics.length > 1 && (
                      <>
                        <motion.line
                          x1="80" y1="50" x2="280" y2="60"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="1"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: domainIndex * 0.3 + 1, duration: 1 }}
                        />
                        <motion.line
                          x1="100" y1="210" x2="260" y2="190"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="1"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: domainIndex * 0.3 + 1.2, duration: 1 }}
                        />
                        <motion.line
                          x1="80" y1="50" x2="100" y2="210"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="1"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: domainIndex * 0.3 + 1.4, duration: 1 }}
                        />
                        <motion.line
                          x1="280" y1="60" x2="260" y2="190"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="1"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: domainIndex * 0.3 + 1.6, duration: 1 }}
                        />
                      </>
                    )}
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <motion.div 
          className="fixed bottom-6 left-6 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <h3 className="font-semibold mb-3">Content Types</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {[
              { type: 'wiki', icon: '📄', label: 'Wiki Articles', color: '#3B82F6' },
              { type: 'podcast', icon: '🎧', label: 'Podcast Episodes', color: '#10B981' },
              { type: 'video', icon: '📺', label: 'Video Tutorials', color: '#EF4444' },
              { type: 'guide', icon: '📖', label: 'Study Guides', color: '#8B5CF6' },
            ].map(({ type, icon, label, color }) => (
              <div key={type} className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs" 
                  style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
                >
                  {icon}
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div 
          className="fixed bottom-6 right-6 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white max-w-xs"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h3 className="font-semibold mb-2">Navigation</h3>
          <p className="text-sm text-gray-300">Click on a domain constellation to explore its topics and content. Each star represents a topic with surrounding content satellites.</p>
        </motion.div>
      </div>
    );
  }

  // Topic Grid View (Domain Selected)
  if (selectedDomain && !selectedTopic) {
    const domain = filteredDomains.find(d => d.id === selectedDomain)!;
    
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Gentle stars */}
        <div className="absolute inset-0 opacity-15">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-blue-200 relative z-10">
          <motion.button 
            onClick={resetView} 
            className="hover:text-white transition-colors flex items-center gap-1"
            whileHover={{ x: -2 }}
          >
            ← Constellation Map
          </motion.button>
          <span>→</span>
          <span className="text-white font-semibold">{domain.title}</span>
        </div>

        {/* Domain Header */}
        <motion.div 
          className="text-center mb-12 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div 
            className={`w-20 h-20 ${domain.color} rounded-full flex items-center justify-center text-4xl shadow-2xl border-4 border-white/30 mx-auto mb-4`}
            style={{
              boxShadow: `0 0 60px ${domain.color.includes('blue') ? '#3B82F6' : 
                                    domain.color.includes('green') ? '#10B981' : 
                                    domain.color.includes('red') ? '#EF4444' : '#8B5CF6'}60`,
            }}
          >
            {domain.icon}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{domain.title}</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">{domain.description}</p>
        </motion.div>

        {/* Topics Grid */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {domain.topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                className="relative"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <motion.div
                  className="cursor-pointer group"
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => setSelectedTopic(topic.id)}
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 4 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      {/* Topic Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-lg">⭐</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{topic.title}</h3>
                          <p className="text-blue-200 text-sm mt-1">{topic.description}</p>
                        </div>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {['wiki', 'podcast', 'video', 'guide'].map((type) => {
                          const content = topic.content.find(c => c.type === type);
                          return (
                            <div 
                              key={type}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                content 
                                  ? 'bg-white/10 border-white/30 hover:bg-white/15' 
                                  : 'bg-gray-500/20 border-gray-500/30'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div 
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                  style={{ 
                                    backgroundColor: content ? getContentColor(type as ContentPiece['type']) : '#666',
                                    boxShadow: content ? `0 0 10px ${getContentColor(type as ContentPiece['type'])}40` : 'none',
                                  }}
                                >
                                  {getContentIcon(type as ContentPiece['type'])}
                                </div>
                                <span className={`text-sm font-medium capitalize ${content ? 'text-white' : 'text-gray-400'}`}>
                                  {type}
                                </span>
                              </div>
                              {content && (
                                <p className="text-xs text-gray-300 truncate">{content.title}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                        <Badge variant="outline" className="text-blue-200 border-blue-200/50">
                          {topic.content.length} resources
                        </Badge>
                        <Button 
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border-0"
                        >
                          Explore →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Content Detail View (Topic Selected)
  if (selectedDomain && selectedTopic) {
    const domain = filteredDomains.find(d => d.id === selectedDomain)!;
    const topic = domain.topics.find(t => t.id === selectedTopic)!;

    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <motion.button 
            onClick={resetView} 
            className="hover:text-white transition-colors"
            whileHover={{ x: -2 }}
          >
            ← Galaxy Map
          </motion.button>
          <span>→</span>
          <motion.button 
            onClick={() => setSelectedTopic(null)} 
            className="hover:text-white transition-colors"
            whileHover={{ x: -2 }}
          >
            {domain.title}
          </motion.button>
          <span>→</span>
          <span className="text-white font-semibold">{topic.title}</span>
        </div>

        {/* Topic Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">{topic.title}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{topic.description}</p>
        </motion.div>

        {/* Content Constellation */}
        <div className="relative max-w-6xl mx-auto" style={{ height: '500px' }}>
          {topic.content.map((content, index) => {
            const angle = (index / topic.content.length) * Math.PI * 2;
            const radius = 200;
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={content.id}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(${x - 150}px, ${y - 100}px)`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                  <Card className="w-80 h-48 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer overflow-hidden">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                          style={{ 
                            backgroundColor: getContentColor(content.type),
                            boxShadow: `0 0 20px ${getContentColor(content.type)}40`,
                          }}
                        >
                          {getContentIcon(content.type)}
                        </div>
                        <div className="flex-1">
                          <Badge variant="outline" className="text-xs mb-1 text-white border-white/30">
                            {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                          </Badge>
                          <h3 className="font-semibold text-white text-sm">{content.title}</h3>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4 flex-1 line-clamp-3">{content.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                          <p>By {content.author}</p>
                          <p>{content.readTime || content.duration}</p>
                        </div>
                        <Button 
                          onClick={() => onContentSelect(content, topic, domain)}
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border-0"
                        >
                          {content.type === 'wiki' || content.type === 'guide' ? 'Read' : 
                           content.type === 'podcast' ? 'Listen' : 'Watch'} →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Connection lines to center */}
                <svg 
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{ 
                    transform: `translate(-${x}px, -${y}px)`,
                    width: Math.abs(x * 2), 
                    height: Math.abs(y * 2) 
                  }}
                >
                  <motion.line
                    x1={x > 0 ? 0 : Math.abs(x * 2)}
                    y1={y > 0 ? 0 : Math.abs(y * 2)}
                    x2={x > 0 ? Math.abs(x * 2) : 0}
                    y2={y > 0 ? Math.abs(y * 2) : 0}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
                  />
                </svg>
              </motion.div>
            );
          })}

          {/* Central hub */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-300 rounded-full flex items-center justify-center text-2xl shadow-lg">
              🎯
            </div>
            <p className="text-center text-white text-sm mt-2 font-semibold">{topic.title}</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Empty State
  if (searchQuery && filteredDomains.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            🔍
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No galaxies found</h3>
          <p className="text-blue-200 max-w-md mx-auto">
            Your search didn't match any domains, topics, or content. Try different keywords or explore the knowledge galaxy.
          </p>
          <motion.button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Return to Galaxy
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return null;
}