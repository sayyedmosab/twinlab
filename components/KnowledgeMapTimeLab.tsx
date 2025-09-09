import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Domain, Topic, ContentPiece } from '../types';

interface KnowledgeMapTimeLabProps {
  domains: Domain[];
  onContentSelect: (content: ContentPiece, topic: Topic, domain: Domain) => void;
  searchQuery: string;
}

export function KnowledgeMapTimeLab({ domains, onContentSelect, searchQuery }: KnowledgeMapTimeLabProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<{
    content: ContentPiece;
    topic: Topic;
    domain: Domain;
  } | null>(null);
  const [temporalFlux, setTemporalFlux] = useState<number[]>([]);
  const [dataStream, setDataStream] = useState('');

  const dataStreamText = "█▓▒░ TEMPORAL DATA STREAM ACTIVE ░▒▓█ FUTURE STATE PROTOCOLS DETECTED █▓▒░ ORGANIZATIONAL TWIN SYNCHRONIZATION IN PROGRESS ░▒▓█";

  // Temporal flux animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTemporalFlux(prev => [...prev.slice(-15), Date.now()]);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Data stream typewriter
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < dataStreamText.length) {
        setDataStream(dataStreamText.slice(0, index + 1));
        index++;
      } else {
        index = 0;
        setDataStream('');
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const getTimeline = (domainTitle: string) => {
    switch (domainTitle.toLowerCase()) {
      case 'the mechanics of transformation': return { 
        era: '2034-2039', 
        status: 'STABLE', 
        icon: '⚡',
        description: 'Post-Transformation Era',
        color: 'from-cyan-400 to-blue-500',
        futureState: 'Complete organizational metamorphosis achieved'
      };
      case 'the architectural blueprint in practice': return { 
        era: '2040-2045', 
        status: 'ADVANCED', 
        icon: '🏗️',
        description: 'Architecture Mastery Era',
        color: 'from-green-400 to-emerald-500',
        futureState: 'Perfect architectural alignment realized'
      };
      case 'the management operating system': return { 
        era: '2046-2051', 
        status: 'OPTIMIZED', 
        icon: '🧠',
        description: 'AI-Human Synthesis Era',
        color: 'from-purple-400 to-violet-500',
        futureState: 'Seamless human-AI management integration'
      };
      case 'an open-source toolkit for your first 90 days': return { 
        era: '2052-2057', 
        status: 'EVOLVED', 
        icon: '🚀',
        description: 'Instantaneous Implementation Era',
        color: 'from-orange-400 to-red-500',
        futureState: 'Zero-friction transformation protocols'
      };
      default: return { 
        era: '20XX-20XX', 
        status: 'UNKNOWN', 
        icon: '❓',
        description: 'Temporal Anomaly',
        color: 'from-gray-400 to-gray-500',
        futureState: 'Timeline disruption detected'
      };
    }
  };

  const getTimeCapsuleType = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return { 
        format: 'HOLOGRAPHIC ARCHIVE', 
        icon: '📊', 
        classification: 'DOCUMENTED FUTURE STATE',
        temporal: 'Crystallized knowledge from successful transformations'
      };
      case 'podcast': return { 
        format: 'NEURAL RECORDING', 
        icon: '🧬', 
        classification: 'MIND-MELD SESSION',
        temporal: 'Direct consciousness transfer from future experts'
      };
      case 'video': return { 
        format: 'TIME-LAPSE SIMULATION', 
        icon: '🔮', 
        classification: 'FUTURE VISUALIZATION',
        temporal: 'Real-time glimpses of transformed organizations'
      };
      case 'guide': return { 
        format: 'PROTOCOL SEQUENCE', 
        icon: '⚡', 
        classification: 'IMPLEMENTATION CODE',
        temporal: 'Step-by-step future transformation blueprints'
      };
    }
  };

  const getTravelerPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 100;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
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
  };

  const closeTimeCapsule = () => {
    setSelectedContent(null);
  };

  // Temporal Laboratory Main View
  if (!selectedDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-900 to-black relative overflow-hidden">
        {/* Temporal Flux Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {temporalFlux.map((time, i) => (
            <motion.div
              key={time}
              className="absolute w-2 h-20 bg-gradient-to-t from-cyan-400/60 to-transparent"
              style={{
                left: `${10 + (i * 5) % 90}%`,
                top: `${5 + (i * 3) % 80}%`,
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: [0, 0.8, 0], scaleY: [0, 1, 0] }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Data Stream */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-black/80 overflow-hidden border-b border-cyan-400/30">
          <motion.div
            className="text-cyan-400 font-mono text-xs py-2 whitespace-nowrap"
            animate={{ x: [1200, -1200] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {dataStream}
          </motion.div>
        </div>

        {/* Laboratory Header */}
        <div className="relative z-10 pt-20 pb-8 text-center">
          <motion.div
            className="inline-block mb-6"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-8xl filter drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">⏰</div>
          </motion.div>
          
          <motion.h1 
            className="text-6xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            TEMPORAL TWIN LAB
          </motion.h1>
          <motion.p 
            className="text-2xl text-cyan-300 italic font-mono"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Knowledge Transfer from Future Organizational States
          </motion.p>
          
          {/* Mission Statement */}
          <motion.div
            className="mt-8 max-w-4xl mx-auto p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-400/30 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-cyan-100 text-lg leading-relaxed font-light">
              Welcome to the Temporal Twin Lab, where <span className="text-cyan-400 font-semibold">successful future organizations</span> have sent their 
              transformation knowledge back through time. Our <span className="text-purple-400 font-semibold">temporal researchers</span> from 
              2034-2057 share the <span className="text-green-400 font-semibold">proven methodologies</span> that created perfect 
              organizational digital twins in their timelines.
            </p>
          </motion.div>
        </div>

        {/* Temporal Portals Grid */}
        <div className="relative max-w-7xl mx-auto px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {filteredDomains.map((domain, index) => {
              const timeline = getTimeline(domain.title);
              
              return (
                <motion.div
                  key={domain.id}
                  className="relative cursor-pointer group"
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 2 + index * 0.3, duration: 0.8 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    rotateX: 5,
                    filter: "drop-shadow(0 20px 40px rgba(0, 255, 255, 0.3))"
                  }}
                  onClick={() => setSelectedDomain(domain.id)}
                >
                  {/* Temporal Portal */}
                  <div className="relative">
                    {/* Portal Ring */}
                    <motion.div
                      className={`w-80 h-80 bg-gradient-to-br ${timeline.color} rounded-full border-4 border-cyan-400/50 shadow-2xl overflow-hidden`}
                      animate={{
                        boxShadow: [
                          "0 0 30px rgba(0, 255, 255, 0.3)",
                          "0 0 60px rgba(0, 255, 255, 0.6)",
                          "0 0 30px rgba(0, 255, 255, 0.3)"
                        ],
                        borderColor: [
                          "rgba(0, 255, 255, 0.5)",
                          "rgba(147, 51, 234, 0.7)",
                          "rgba(0, 255, 255, 0.5)"
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {/* Swirling energy inside portal */}
                      <motion.div
                        className="absolute inset-4 rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                      
                      {/* Portal Center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="text-8xl filter drop-shadow-lg"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotateZ: [0, 10, -10, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                        >
                          {timeline.icon}
                        </motion.div>
                      </div>

                      {/* Future timeline indicator */}
                      <div className="absolute top-4 left-4 right-4">
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className={`text-xs font-mono ${
                              timeline.status === 'EVOLVED' ? 'border-red-400 text-red-300' :
                              timeline.status === 'OPTIMIZED' ? 'border-purple-400 text-purple-300' :
                              timeline.status === 'ADVANCED' ? 'border-green-400 text-green-300' :
                              'border-cyan-400 text-cyan-300'
                            }`}>
                              {timeline.status}
                            </Badge>
                            <span className="text-xs text-cyan-300 font-mono">{timeline.era}</span>
                          </div>
                          <h3 className="text-white font-bold text-sm leading-tight mb-1">{timeline.description}</h3>
                          <p className="text-cyan-200 text-xs">{timeline.futureState}</p>
                        </div>
                      </div>

                      {/* Time travelers orbiting the portal */}
                      {domain.topics.slice(0, 3).map((topic, topicIndex) => {
                        const travelerPos = getTravelerPosition(topicIndex, 3);
                        
                        return (
                          <motion.div
                            key={topic.id}
                            className="absolute w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full border-2 border-white/50"
                            style={{
                              left: travelerPos.x / 2 + 150,
                              top: travelerPos.y / 2 + 150,
                            }}
                            animate={{
                              rotate: 360,
                              scale: [1, 1.5, 1],
                            }}
                            transition={{
                              rotate: { duration: 6 + topicIndex, repeat: Infinity, ease: "linear" },
                              scale: { duration: 2, repeat: Infinity, delay: topicIndex * 0.5 }
                            }}
                          />
                        );
                      })}
                    </motion.div>

                    {/* Portal Information */}
                    <div className="absolute -bottom-4 left-4 right-4">
                      <div className="bg-gradient-to-r from-black/80 to-slate-900/80 backdrop-blur-sm rounded-lg p-4 border border-cyan-400/30">
                        <h3 className="text-cyan-300 font-bold text-lg mb-2 leading-tight">{domain.title}</h3>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{domain.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-purple-300 font-mono">
                            {domain.topics.length} Time Travelers
                          </span>
                          <span className="text-green-300 font-mono">
                            {domain.topics.reduce((acc, topic) => acc + topic.content.length, 0)} Time Capsules
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Portal activation effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-cyan-400 opacity-0 group-hover:opacity-100 scale-110"
                    animate={{
                      scale: [1.1, 1.2, 1.1],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>


      </div>
    );
  }

  // Timeline Research Station (Domain Selected)
  if (selectedDomain && !selectedTopic) {
    const domain = filteredDomains.find(d => d.id === selectedDomain)!;
    const timeline = getTimeline(domain.title);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black relative overflow-hidden">
        {/* Timeline Energy Field */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className={`absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r ${timeline.color} rounded-full blur-3xl`}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
              x: [0, 100, 0]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        {/* Breadcrumb Navigation */}
        <div className="pt-8 pb-6 px-8 flex items-center gap-2 text-sm text-gray-300 relative z-10 font-mono">
          <motion.button 
            onClick={resetView} 
            className="hover:text-cyan-300 transition-colors flex items-center gap-1 bg-black/50 px-3 py-1 rounded border border-cyan-400/30"
            whileHover={{ x: -2 }}
          >
            ← TEMPORAL LAB
          </motion.button>
          <span>/</span>
          <span className="text-cyan-300 font-bold">{timeline.era}</span>
        </div>

        {/* Timeline Header */}
        <motion.div 
          className="text-center mb-12 relative z-10 px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-8xl mb-4 filter drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            {timeline.icon}
          </motion.div>
          <h1 className={`text-5xl font-bold text-transparent bg-gradient-to-r ${timeline.color} bg-clip-text mb-2`}>
            {timeline.description.toUpperCase()}
          </h1>
          <h2 className="text-3xl text-cyan-300 mb-4 font-mono">{timeline.era}</h2>
          <p className="text-xl text-gray-300 italic mb-4 max-w-3xl mx-auto">{domain.description}</p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className={`text-lg px-4 py-2 font-mono ${
              timeline.status === 'EVOLVED' ? 'border-red-400 text-red-300' :
              timeline.status === 'OPTIMIZED' ? 'border-purple-400 text-purple-300' :
              timeline.status === 'ADVANCED' ? 'border-green-400 text-green-300' :
              'border-cyan-400 text-cyan-300'
            }`}>
              STATUS: {timeline.status}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 font-mono text-purple-300 border-purple-400">
              {domain.topics.length} TIME TRAVELERS
            </Badge>
          </div>
        </motion.div>

        {/* Time Travelers */}
        <div className="relative max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domain.topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                className="relative"
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: index * 0.2, type: "spring" }}
              >
                <motion.div
                  className="group cursor-pointer"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    filter: "drop-shadow(0 20px 40px rgba(0, 255, 255, 0.3))"
                  }}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <Card className={`bg-gradient-to-br from-slate-800/50 to-slate-900/80 border-2 border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 overflow-hidden backdrop-blur-sm`}>
                    <CardContent className="p-6 relative">
                      {/* Holographic Avatar */}
                      <div className="relative mb-6">
                        <motion.div
                          className={`w-20 h-20 bg-gradient-to-br ${timeline.color} rounded-full flex items-center justify-center text-3xl border-4 border-cyan-400/50 shadow-lg mx-auto`}
                          animate={{
                            boxShadow: [
                              "0 0 20px rgba(0, 255, 255, 0.3)",
                              "0 0 40px rgba(147, 51, 234, 0.5)",
                              "0 0 20px rgba(0, 255, 255, 0.3)"
                            ],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{
                            duration: 4 + index * 0.5,
                            repeat: Infinity,
                          }}
                        >
                          🚀
                        </motion.div>

                        {/* Time Traveler ID */}
                        <motion.div
                          className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm text-white font-bold font-mono border-2 border-white"
                          animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            rotate: { duration: 6, repeat: Infinity },
                            scale: { duration: 2, repeat: Infinity, delay: index * 0.5 }
                          }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </motion.div>

                        {/* Knowledge Capsule Count */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-cyan-300 px-3 py-1 rounded-full text-xs font-mono border border-cyan-400/50">
                          {topic.content.length} CAPSULES
                        </div>
                      </div>

                      {/* Traveler Info */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-cyan-300 mb-2 font-mono">
                          SPECIALIST: {topic.title.toUpperCase()}
                        </h3>
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">{topic.description}</p>
                      </div>

                      {/* Time Capsule Types */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {['wiki', 'podcast', 'video', 'guide'].map((type) => {
                          const hasCapsule = topic.content.some(c => c.type === type);
                          const capsuleType = getTimeCapsuleType(type as ContentPiece['type']);
                          
                          return (
                            <div
                              key={type}
                              className={`p-2 rounded border transition-all text-center text-xs ${
                                hasCapsule 
                                  ? 'bg-cyan-400/10 border-cyan-400/50 text-cyan-300' 
                                  : 'bg-gray-800/50 border-gray-600/50 text-gray-500'
                              }`}
                            >
                              <div className="text-lg mb-1">{capsuleType.icon}</div>
                              <div className="font-mono font-bold">{capsuleType.classification}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Temporal Expertise */}
                      <div className="mb-4 p-3 bg-black/30 rounded border border-purple-400/30">
                        <h4 className="text-purple-300 font-bold text-xs mb-2 font-mono">TEMPORAL EXPERTISE:</h4>
                        <p className="text-gray-300 text-xs leading-relaxed">
                          {timeline.futureState} - Specialized knowledge from {timeline.era} timeline.
                        </p>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-mono font-bold">
                        ACCESS TIME CAPSULES →
                      </Button>
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

  // Time Capsule Archive (Topic Selected)
  if (selectedDomain && selectedTopic) {
    const domain = filteredDomains.find(d => d.id === selectedDomain)!;
    const topic = domain.topics.find(t => t.id === selectedTopic)!;
    const timeline = getTimeline(domain.title);

    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-purple-900 relative overflow-hidden">
        {/* Breadcrumb */}
        <div className="pt-8 pb-6 px-8 flex items-center gap-2 text-sm text-gray-300 relative z-10 font-mono">
          <motion.button 
            onClick={resetView} 
            className="hover:text-cyan-300 transition-colors bg-black/50 px-3 py-1 rounded border border-cyan-400/30"
            whileHover={{ x: -2 }}
          >
            ← TEMPORAL LAB
          </motion.button>
          <span>/</span>
          <motion.button 
            onClick={() => setSelectedTopic(null)} 
            className="hover:text-cyan-300 transition-colors bg-black/50 px-3 py-1 rounded border border-cyan-400/30"
            whileHover={{ x: -2 }}
          >
            {timeline.era}
          </motion.button>
          <span>/</span>
          <span className="text-cyan-300 font-bold">SPECIALIST {topic.title.toUpperCase()}</span>
        </div>

        {/* Time Traveler Header */}
        <motion.div 
          className="text-center mb-8 px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className={`w-16 h-16 bg-gradient-to-br ${timeline.color} rounded-full flex items-center justify-center text-3xl border-4 border-cyan-400/50 shadow-lg`}
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              🚀
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-cyan-300 mb-2 font-mono">
            TIME TRAVELER: {topic.title.toUpperCase()}
          </h1>
          <p className="text-xl text-gray-300 italic mb-4">{topic.description}</p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="text-cyan-300 border-cyan-400 bg-black/50 font-mono">
              FROM: {timeline.era}
            </Badge>
            <Badge variant="outline" className="text-purple-300 border-purple-400 bg-black/50 font-mono">
              CAPSULES: {topic.content.length}
            </Badge>
          </div>
        </motion.div>

        {/* Time Capsules */}
        <div className="relative max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {topic.content.map((content, index) => (
              <motion.div
                key={content.id}
                className="relative"
                initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <motion.div
                  className="group cursor-pointer"
                  whileHover={{ 
                    scale: 1.02, 
                    y: -6,
                    filter: "drop-shadow(0 20px 40px rgba(0, 255, 255, 0.2))"
                  }}
                  onClick={() => handleContentClick(content, topic, domain)}
                >
                  <Card className="bg-gradient-to-br from-slate-800/80 to-black/60 border-2 border-cyan-400/30 hover:border-purple-400/60 transition-all duration-300 overflow-hidden backdrop-blur-sm">
                    <CardContent className="p-6 relative">
                      {/* Time Capsule Seal */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-cyan-400/80 to-purple-400/80 text-black flex items-center justify-center font-mono text-xs font-bold">
                        ⏰ TEMPORAL CAPSULE - AUTHORIZED ACCESS ONLY ⏰
                      </div>

                      {/* Capsule Details */}
                      <div className="mt-8 relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-12 h-12 bg-gradient-to-br ${timeline.color} rounded border-2 border-cyan-400 flex items-center justify-center text-xl text-white`}>
                              {getTimeCapsuleType(content.type).icon}
                            </div>
                            <div className="flex-1">
                              <Badge variant="outline" className="text-cyan-300 border-cyan-400 mb-1 font-mono text-xs">
                                {getTimeCapsuleType(content.type).format}
                              </Badge>
                              <h3 className="font-bold text-white leading-tight">{content.title}</h3>
                            </div>
                          </div>
                          <motion.div
                            className="text-2xl"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, delay: index }}
                          >
                            ⚡
                          </motion.div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">{content.description}</p>
                        
                        {/* Temporal Metadata */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-xs bg-purple-900/20 p-3 rounded border border-purple-400/30 font-mono">
                          <div>
                            <span className="font-bold text-purple-300">TRANSMITTED BY:</span>
                            <p className="text-gray-300">{content.author}</p>
                          </div>
                          <div>
                            <span className="font-bold text-purple-300">TEMPORAL STAMP:</span>
                            <p className="text-gray-300">{content.publishedAt}</p>
                          </div>
                          <div>
                            <span className="font-bold text-purple-300">DURATION:</span>
                            <p className="text-gray-300">{content.readTime || content.duration}</p>
                          </div>
                          <div>
                            <span className="font-bold text-purple-300">CLASSIFICATION:</span>
                            <p className="text-gray-300">{getTimeCapsuleType(content.type).classification}</p>
                          </div>
                        </div>
                        
                        {/* Knowledge Tags */}
                        <div className="mb-4">
                          <p className="text-xs font-bold text-purple-300 mb-2 font-mono">KNOWLEDGE VECTORS:</p>
                          <div className="flex flex-wrap gap-1">
                            {content.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-cyan-300 border-cyan-400/50 text-xs font-mono">
                                #{tag.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Temporal Description */}
                        <div className="mb-4 p-3 bg-black/30 rounded border border-cyan-400/30">
                          <p className="text-xs text-cyan-200 leading-relaxed">
                            <span className="font-bold text-cyan-300">TEMPORAL INSIGHT:</span> {getTimeCapsuleType(content.type).temporal}
                          </p>
                        </div>
                        
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-mono font-bold">
                          <span className="mr-2">🔮</span>
                          {content.type === 'wiki' || content.type === 'guide' ? 'ACCESS ARCHIVE' : 
                           content.type === 'podcast' ? 'INITIATE NEURAL LINK' : 'VIEW TIME-LAPSE'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Temporal Interface */}
        <AnimatePresence>
          {selectedContent && (
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeTimeCapsule}
            >
              <motion.div
                className="bg-gradient-to-br from-slate-900 to-black rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-cyan-400 shadow-2xl"
                initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: -20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Temporal Interface Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-cyan-400">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${timeline.color} rounded border-4 border-cyan-400 flex items-center justify-center text-2xl text-white`}>
                      {getTimeCapsuleType(selectedContent.content.type).icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-cyan-300 font-mono">{selectedContent.content.title}</h2>
                      <p className="text-gray-300 font-mono">Transmitted by Specialist {selectedContent.topic.title}</p>
                      <Badge variant="outline" className="mt-1 text-cyan-300 border-cyan-400 font-mono">
                        {getTimeCapsuleType(selectedContent.content.type).format}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" onClick={closeTimeCapsule} className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 font-mono">
                    ✕ CLOSE LINK
                  </Button>
                </div>

                {/* Temporal Synchronization */}
                <div className="bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-xl p-4 mb-6 border-2 border-cyan-400/50">
                  <div className="flex items-center gap-4 mb-2">
                    <motion.span 
                      className="text-2xl"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      ⚡
                    </motion.span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-cyan-300 mb-1 font-mono">
                        <span>TEMPORAL SYNCHRONIZATION</span>
                        <span>TIMELINE: {timeline.era} • {selectedContent.content.readTime || selectedContent.content.duration}</span>
                      </div>
                      <div className="w-full bg-cyan-400/20 rounded-full h-3 border border-cyan-400/50">
                        <motion.div
                          className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Temporal Content */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2 font-mono">
                    🔮 FUTURE STATE TRANSMISSION
                  </h3>
                  <div className="bg-gradient-to-r from-slate-800/50 to-black/50 p-6 rounded-xl border-2 border-purple-400/30">
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">{selectedContent.content.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/50 p-4 rounded-lg border border-cyan-400/30">
                        <h4 className="font-bold text-cyan-300 mb-2 font-mono">⏰ TEMPORAL ANALYSIS:</h4>
                        <p className="text-sm text-gray-300">
                          This {getTimeCapsuleType(selectedContent.content.type).classification.toLowerCase()} represents 
                          proven methodologies from the {timeline.description.toLowerCase()} where {timeline.futureState.toLowerCase()}.
                        </p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-purple-400/30">
                        <h4 className="font-bold text-purple-300 mb-2 font-mono">🚀 IMPLEMENTATION VECTORS:</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedContent.content.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-purple-300 border-purple-400/50 text-xs font-mono">
                              #{tag.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Temporal Transfer Action */}
                <div className="text-center">
                  <Button 
                    onClick={() => {
                      closeTimeCapsule();
                      onContentSelect(selectedContent.content, selectedContent.topic, selectedContent.domain);
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg rounded-xl font-mono font-bold"
                  >
                    <span className="mr-3">⚡</span>
                    INITIATE FULL KNOWLEDGE TRANSFER
                    <span className="ml-3">🚀</span>
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-900 to-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div 
            className="text-8xl mb-6"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🌀
          </motion.div>
          <h3 className="text-3xl font-bold text-cyan-300 mb-4 font-mono">TEMPORAL ANOMALY DETECTED</h3>
          <p className="text-gray-300 max-w-md mx-auto text-lg">
            Your search parameters created a temporal disruption. No timelines, travelers, or knowledge capsules match your query. 
            Try different vectors or return to the temporal laboratory.
          </p>
          <motion.button
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-colors font-mono font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RETURN TO TEMPORAL LAB
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return null;
}