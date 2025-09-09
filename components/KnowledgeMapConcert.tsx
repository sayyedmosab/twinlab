import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Domain, Topic, ContentPiece } from '../types';

interface KnowledgeMapConcertProps {
  domains: Domain[];
  onContentSelect: (content: ContentPiece, topic: Topic, domain: Domain) => void;
  searchQuery: string;
}

export function KnowledgeMapConcert({ domains, onContentSelect, searchQuery }: KnowledgeMapConcertProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<{
    content: ContentPiece;
    topic: Topic;
    domain: Domain;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Musical note animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getInstrumentIcon = (domainTitle: string) => {
    switch (domainTitle.toLowerCase()) {
      case 'modeling & simulation': return '🎻'; // Strings - precise and detailed
      case 'data integration': return '🎺'; // Brass - powerful and connecting
      case 'iot & sensors': return '🎷'; // Woodwinds - sensitive and responsive  
      case 'visualization': return '🥁'; // Percussion - visual and rhythmic
      default: return '🎼';
    }
  };

  const getMusicalGenre = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return 'Classical'; // Structured and foundational
      case 'podcast': return 'Jazz'; // Conversational and flowing
      case 'video': return 'Symphony'; // Rich and visual
      case 'guide': return 'Chamber'; // Intimate and instructional
    }
  };

  const getMusicalIcon = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return '📜'; // Musical score
      case 'podcast': return '🎙️'; // Microphone
      case 'video': return '🎬'; // Film/performance
      case 'guide': return '🎼'; // Sheet music
    }
  };

  const getMusicianPosition = (index: number, total: number) => {
    // Arrange musicians in a semi-circle formation
    const angle = (index / (total - 1)) * Math.PI;
    const radius = 120;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.6, // Flatten the circle
    };
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
    setSelectedContent(null);
  };

  const handleContentClick = (content: ContentPiece, topic: Topic, domain: Domain) => {
    setSelectedContent({ content, topic, domain });
    setIsPlaying(true);
  };

  const closeContentViewer = () => {
    setSelectedContent(null);
    setIsPlaying(false);
  };

  // Concert Hall View (Main View)
  if (!selectedDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black relative overflow-hidden">
        {/* Floating musical notes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['♪', '♫', '♬', '♩', '♭', '♯'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>

        {/* Concert Hall Header */}
        <div className="relative z-10 pt-12 pb-8 text-center">
          <motion.div
            className="inline-block mb-6"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="text-8xl">🎼</div>
          </motion.div>
          <motion.h1 
            className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Digital Twins Symphony
          </motion.h1>
          <motion.p 
            className="text-2xl text-purple-200 italic"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Where Knowledge Creates Beautiful Music
          </motion.p>
        </div>

        {/* Orchestra Stage */}
        <div className="relative max-w-7xl mx-auto px-8">
          {/* Stage Platform */}
          <motion.div
            className="relative bg-gradient-to-t from-amber-900/20 to-amber-700/10 rounded-t-full mx-auto border-t-4 border-amber-400/30"
            style={{ width: '800px', height: '400px' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Orchestra Sections */}
            {filteredDomains.map((domain, index) => {
              // Position sections in orchestra formation
              const positions = [
                { x: 150, y: 280, name: 'Left Wing' },   // Strings
                { x: 400, y: 200, name: 'Center' },      // Brass  
                { x: 650, y: 280, name: 'Right Wing' },  // Woodwinds
                { x: 400, y: 120, name: 'Back Row' },    // Percussion
              ];
              
              const position = positions[index] || positions[0];

              return (
                <motion.div
                  key={domain.id}
                  className="absolute cursor-pointer group"
                  style={{
                    left: position.x - 60,
                    top: position.y - 60,
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  onClick={() => setSelectedDomain(domain.id)}
                >
                  {/* Orchestra Section Platform */}
                  <div className="relative">
                    <div className="w-24 h-16 bg-gradient-to-t from-amber-800/40 to-amber-600/20 rounded-lg border border-amber-400/30 flex items-center justify-center">
                      <div className="text-4xl transform group-hover:scale-110 transition-transform">
                        {getInstrumentIcon(domain.title)}
                      </div>
                    </div>
                    
                    {/* Musicians (Topics) arranged around the section */}
                    {domain.topics.slice(0, 4).map((topic, topicIndex) => {
                      const angle = (topicIndex / 4) * Math.PI * 2;
                      const radius = 35;
                      const musicianX = Math.cos(angle) * radius;
                      const musicianY = Math.sin(angle) * radius;

                      return (
                        <motion.div
                          key={topic.id}
                          className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                          style={{
                            left: musicianX + 48,
                            top: musicianY + 32,
                          }}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: 2 + topicIndex * 0.5,
                            repeat: Infinity,
                            delay: topicIndex * 0.3,
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Section Info */}
                  <motion.div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  >
                    <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-center min-w-max">
                      <h3 className="font-semibold text-sm">{domain.title}</h3>
                      <p className="text-xs text-gray-300 mt-1">{position.name} Section</p>
                      <p className="text-xs text-yellow-300">{domain.topics.length} Musicians • {domain.topics.reduce((acc, topic) => acc + topic.content.length, 0)} Pieces</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Conductor Podium */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <div className="w-16 h-8 bg-gradient-to-t from-amber-900/60 to-amber-700/40 rounded-t-lg border-t-2 border-amber-400/50 flex items-center justify-center">
                <motion.div
                  className="text-2xl"
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎩
                </motion.div>
              </div>
              <p className="text-center text-yellow-300 text-xs mt-2 font-semibold">Conductor</p>
            </motion.div>
          </motion.div>

          {/* Audience Seats */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="flex justify-center space-x-1 mb-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-2 h-3 bg-red-800/60 rounded-t-sm" />
              ))}
            </div>
            <div className="flex justify-center space-x-1 mb-2">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-2 h-3 bg-red-700/60 rounded-t-sm" />
              ))}
            </div>
            <div className="flex justify-center space-x-1">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="w-2 h-3 bg-red-600/60 rounded-t-sm" />
              ))}
            </div>
            <p className="text-purple-300 text-sm mt-4 italic">Click any orchestra section to meet the musicians</p>
          </motion.div>
        </div>

        {/* Program Notes */}
        <motion.div 
          className="fixed bottom-6 left-6 bg-black/80 backdrop-blur-sm rounded-xl p-4 text-white border border-yellow-400/30"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5 }}
        >
          <h3 className="font-bold mb-3 text-yellow-300 flex items-center gap-2">
            🎼 Program Notes
          </h3>
          <div className="space-y-2 text-sm">
            {[
              { icon: '📜', genre: 'Classical', desc: 'Technical Documentation' },
              { icon: '🎙️', genre: 'Jazz', desc: 'Audio Discussions' },
              { icon: '🎬', genre: 'Symphony', desc: 'Visual Performances' },
              { icon: '🎼', genre: 'Chamber', desc: 'Study Guides' },
            ].map(({ icon, genre, desc }) => (
              <div key={genre} className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <div>
                  <span className="text-yellow-300 font-semibold">{genre}:</span>
                  <span className="text-gray-300 ml-2">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Orchestra Section View (Domain Selected)
  if (selectedDomain && !selectedTopic) {
    const domain = filteredDomains.find(d => d.id === selectedDomain)!;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-purple-900 relative overflow-hidden">
        {/* Musical staff lines */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-white"
              style={{ top: `${20 + i * 8}%` }}
            />
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="pt-8 pb-6 px-8 flex items-center gap-2 text-sm text-purple-200 relative z-10">
          <motion.button 
            onClick={resetView} 
            className="hover:text-white transition-colors flex items-center gap-1"
            whileHover={{ x: -2 }}
          >
            ← Concert Hall
          </motion.button>
          <span>/</span>
          <span className="text-white font-semibold">{domain.title} Section</span>
        </div>

        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-8xl mb-4">{getInstrumentIcon(domain.title)}</div>
          <h1 className="text-5xl font-bold text-white mb-4">{domain.title}</h1>
          <p className="text-xl text-purple-200 italic">{domain.description}</p>
          <Badge variant="outline" className="mt-4 text-yellow-300 border-yellow-300/50">
            {domain.topics.length} Musicians • {domain.topics.reduce((acc, topic) => acc + topic.content.length, 0)} Musical Pieces
          </Badge>
        </motion.div>

        {/* Musicians Arrangement */}
        <div className="relative max-w-6xl mx-auto px-8">
          <div className="relative bg-gradient-to-t from-amber-900/10 to-transparent rounded-full mx-auto" style={{ width: '600px', height: '400px' }}>
            {domain.topics.map((topic, index) => {
              const position = getMusicianPosition(index, domain.topics.length);
              
              return (
                <motion.div
                  key={topic.id}
                  className="absolute cursor-pointer group"
                  style={{
                    left: position.x + 280,
                    top: position.y + 200,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  {/* Musician */}
                  <div className="relative">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl border-4 border-yellow-300/50 shadow-lg"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(255, 215, 0, 0.3)",
                          "0 0 30px rgba(255, 215, 0, 0.6)",
                          "0 0 20px rgba(255, 215, 0, 0.3)"
                        ]
                      }}
                      transition={{
                        duration: 2 + index * 0.3,
                        repeat: Infinity,
                      }}
                    >
                      🎭
                    </motion.div>

                    {/* Music Stand with Sheets */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-gray-800 rounded-sm flex items-center justify-center transform rotate-12">
                        <div className="text-xs">📜</div>
                      </div>
                    </div>

                    {/* Repertoire Count */}
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {topic.content.length}
                    </motion.div>
                  </div>

                  {/* Musician Info */}
                  <motion.div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    initial={false}
                  >
                    <div className="bg-black/90 text-white px-4 py-3 rounded-lg text-center min-w-max">
                      <h3 className="font-bold text-yellow-300">{topic.title}</h3>
                      <p className="text-xs text-gray-300 mt-1">{topic.description}</p>
                      <div className="flex gap-1 mt-2 justify-center">
                        {['wiki', 'podcast', 'video', 'guide'].map((type) => {
                          const hasContent = topic.content.some(c => c.type === type);
                          return (
                            <div
                              key={type}
                              className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                                hasContent ? 'bg-yellow-400 text-black' : 'bg-gray-600 text-gray-400'
                              }`}
                            >
                              {getMusicalIcon(type as ContentPiece['type'])}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-yellow-300 mt-2">{topic.content.length} pieces in repertoire</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Musician's Repertoire (Topic Selected)
  if (selectedDomain && selectedTopic) {
    const domain = filteredDomains.find(d => d.id === selectedDomain)!;
    const topic = domain.topics.find(t => t.id === selectedTopic)!;

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black relative overflow-hidden">
        {/* Breadcrumb */}
        <div className="pt-8 pb-6 px-8 flex items-center gap-2 text-sm text-purple-200 relative z-10">
          <motion.button 
            onClick={resetView} 
            className="hover:text-white transition-colors"
            whileHover={{ x: -2 }}
          >
            ← Concert Hall
          </motion.button>
          <span>/</span>
          <motion.button 
            onClick={() => setSelectedTopic(null)} 
            className="hover:text-white transition-colors"
            whileHover={{ x: -2 }}
          >
            {domain.title}
          </motion.button>
          <span>/</span>
          <span className="text-white font-semibold">{topic.title}</span>
        </div>

        {/* Musician Header */}
        <motion.div 
          className="text-center mb-8 px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-4xl font-bold text-white mb-2">{topic.title}</h1>
          <p className="text-xl text-purple-200 italic mb-4">{topic.description}</p>
          <Badge variant="outline" className="text-yellow-300 border-yellow-300/50">
            Repertoire: {topic.content.length} Musical Pieces
          </Badge>
        </motion.div>

        {/* Sheet Music Collection */}
        <div className="relative max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topic.content.map((content, index) => (
              <motion.div
                key={content.id}
                className="relative"
                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <motion.div
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.02, y: -4, rotateY: 5 }}
                  onClick={() => handleContentClick(content, topic, domain)}
                >
                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-200 hover:border-yellow-400 transition-all duration-300 overflow-hidden shadow-xl">
                    <CardContent className="p-6 relative">
                      {/* Musical Staff Background */}
                      <div className="absolute inset-0 opacity-10">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-full h-px bg-black"
                            style={{ top: `${20 + i * 15}%` }}
                          />
                        ))}
                      </div>

                      {/* Sheet Music Header */}
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-xl text-white">
                              {getMusicalIcon(content.type)}
                            </div>
                            <div>
                              <Badge variant="outline" className="text-purple-600 border-purple-300 mb-1">
                                {getMusicalGenre(content.type)} {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                              </Badge>
                              <h3 className="font-bold text-gray-800">{content.title}</h3>
                            </div>
                          </div>
                          <motion.div
                            className="text-2xl"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, delay: index }}
                          >
                            ♪
                          </motion.div>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-4">{content.description}</p>
                        
                        {/* Musical Details */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                          <div>
                            <span className="font-semibold text-gray-600">Composer:</span>
                            <p className="text-gray-800">{content.author}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-600">Duration:</span>
                            <p className="text-gray-800">{content.readTime || content.duration}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-600">Premiered:</span>
                            <p className="text-gray-800">{content.publishedAt}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-600">Genre:</span>
                            <p className="text-gray-800">{getMusicalGenre(content.type)}</p>
                          </div>
                        </div>
                        
                        {/* Tags as Musical Themes */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {content.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-indigo-600 border-indigo-200 text-xs">
                              ♫ {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                          <span className="mr-2">▶</span>
                          {content.type === 'wiki' || content.type === 'guide' ? 'Read Score' : 
                           content.type === 'podcast' ? 'Play Performance' : 'Watch Concert'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content Viewer Overlay */}
        <AnimatePresence>
          {selectedContent && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeContentViewer}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Music Player Header */}
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl text-white">
                      {getMusicalIcon(selectedContent.content.type)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedContent.content.title}</h2>
                      <p className="text-gray-600">by {selectedContent.content.author}</p>
                      <Badge variant="outline" className="mt-1">
                        {getMusicalGenre(selectedContent.content.type)} • {selectedContent.content.type}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" onClick={closeContentViewer}>
                    ✕
                  </Button>
                </div>

                {/* Music Player Controls */}
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.button
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                        isPlaying ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </motion.button>
                    <div className="flex-1">
                      <div className="w-full bg-gray-300 rounded-full h-2 mb-1">
                        <motion.div
                          className="bg-purple-500 h-2 rounded-full"
                          animate={{ width: isPlaying ? '100%' : '0%' }}
                          transition={{ duration: 20, ease: "linear" }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0:00</span>
                        <span>{selectedContent.content.readTime || selectedContent.content.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed">{selectedContent.content.description}</p>
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      🎵 This {getMusicalGenre(selectedContent.content.type).toLowerCase()} piece explores the themes of {selectedContent.content.tags.join(', ')} 
                      in the context of {selectedContent.topic.title.toLowerCase()}.
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 text-center">
                  <Button 
                    onClick={() => {
                      closeContentViewer();
                      onContentSelect(selectedContent.content, selectedContent.topic, selectedContent.domain);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3"
                  >
                    Experience Full Performance →
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Empty State
  if (searchQuery && filteredDomains.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-8xl mb-6">🎼</div>
          <h3 className="text-3xl font-bold text-white mb-4">No Music Found</h3>
          <p className="text-purple-200 max-w-md mx-auto text-lg">
            Your search didn't match any sections, musicians, or musical pieces. Try different keywords or return to the concert hall.
          </p>
          <motion.button
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Return to Concert Hall
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return null;
}