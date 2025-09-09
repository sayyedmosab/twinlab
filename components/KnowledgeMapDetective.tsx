import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Domain, Topic, ContentPiece } from '../types';

interface KnowledgeMapDetectiveProps {
  domains: Domain[];
  onContentSelect: (content: ContentPiece, topic: Topic, domain: Domain) => void;
  searchQuery: string;
}

export function KnowledgeMapDetective({ domains, onContentSelect, searchQuery }: KnowledgeMapDetectiveProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<{
    content: ContentPiece;
    topic: Topic;
    domain: Domain;
  } | null>(null);
  const [typewriterText, setTypewriterText] = useState('');
  const [evidenceScanning, setEvidenceScanning] = useState(false);

  const fullText = "CLASSIFIED: Digital Twins Investigation Unit";

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypewriterText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const getCaseDetails = (domainTitle: string) => {
    switch (domainTitle.toLowerCase()) {
      case 'modeling & simulation': return { 
        caseNumber: 'CASE-001', 
        status: 'ACTIVE', 
        priority: 'HIGH',
        icon: '🔬',
        evidence: 'Digital Blueprints',
        color: 'from-blue-500 to-cyan-500'
      };
      case 'data integration': return { 
        caseNumber: 'CASE-002', 
        status: 'URGENT', 
        priority: 'CRITICAL',
        icon: '🔗',
        evidence: 'Data Connections',
        color: 'from-green-500 to-emerald-500'
      };
      case 'iot & sensors': return { 
        caseNumber: 'CASE-003', 
        status: 'ACTIVE', 
        priority: 'HIGH',
        icon: '📡',
        evidence: 'Sensor Networks',
        color: 'from-orange-500 to-red-500'
      };
      case 'visualization': return { 
        caseNumber: 'CASE-004', 
        status: 'REVIEWING', 
        priority: 'MEDIUM',
        icon: '🎯',
        evidence: 'Visual Intelligence',
        color: 'from-purple-500 to-pink-500'
      };
      default: return { 
        caseNumber: 'CASE-XXX', 
        status: 'UNKNOWN', 
        priority: 'LOW',
        icon: '❓',
        evidence: 'Unknown',
        color: 'from-gray-500 to-gray-600'
      };
    }
  };

  const getEvidenceType = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return { type: 'CASE FILE', icon: '📋', classification: 'DOCUMENTED' };
      case 'podcast': return { type: 'AUDIO EVIDENCE', icon: '🎧', classification: 'RECORDED' };
      case 'video': return { type: 'SURVEILLANCE', icon: '📹', classification: 'VISUAL' };
      case 'guide': return { type: 'PROTOCOL', icon: '📝', classification: 'PROCEDURE' };
    }
  };

  const getDetectivePosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 80;
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
    setEvidenceScanning(true);
    setTimeout(() => setEvidenceScanning(false), 2000);
  };

  const closeEvidenceViewer = () => {
    setSelectedContent(null);
    setEvidenceScanning(false);
  };

  // Investigation Bureau Main View
  if (!selectedDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-black relative overflow-hidden">
        {/* Police Station Lighting */}
        <div className="absolute inset-0">
          {/* Flickering overhead lights */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-2 bg-yellow-300/20 blur-md"
              style={{ 
                left: `${10 + i * 15}%`, 
                top: '10px',
              }}
              animate={{ 
                opacity: [0.3, 0.8, 0.3],
                scaleY: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2 + Math.random(), 
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
          
          {/* Red emergency light */}
          <motion.div
            className="absolute top-4 right-8 w-6 h-6 bg-red-500 rounded-full blur-sm"
            animate={{ 
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Bureau Header */}
        <div className="relative z-10 pt-16 pb-8 text-center">
          <motion.div
            className="inline-block mb-6"
            animate={{ 
              rotate: [0, 2, -2, 0],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <div className="text-8xl">🕵️</div>
          </motion.div>
          
          {/* Typewriter effect */}
          <motion.div 
            className="font-mono text-4xl text-green-400 mb-4 h-12 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {typewriterText}
            <motion.span
              className="ml-1 w-3 h-8 bg-green-400"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
          
          <motion.p 
            className="text-xl text-red-400 italic font-mono tracking-wider"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4 }}
          >
            ████ █████ ███ ████████ ██ ████ ██████
          </motion.p>
          <motion.p 
            className="text-lg text-gray-300 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5 }}
          >
            Investigating the mysteries of Physical-Digital convergence
          </motion.p>
        </div>

        {/* Investigation Board */}
        <div className="relative max-w-7xl mx-auto px-8">
          <motion.div
            className="relative bg-gradient-to-b from-slate-700/50 to-slate-800/80 rounded-lg mx-auto border-2 border-yellow-400/30 backdrop-blur-sm"
            style={{ minHeight: '600px' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 6 }}
          >
            {/* Evidence Board Header */}
            <div className="bg-yellow-400/90 text-black px-6 py-3 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xl font-bold">INVESTIGATION BOARD - ACTIVE CASES</h2>
                <div className="flex items-center gap-4 text-sm font-mono">
                  <span className="bg-red-500 text-white px-2 py-1 rounded">CLASSIFIED</span>
                  <span>EST. 2024</span>
                </div>
              </div>
            </div>

            {/* Case Files */}
            <div className="p-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {filteredDomains.map((domain, index) => {
                  const caseDetails = getCaseDetails(domain.title);
                  
                  return (
                    <motion.div
                      key={domain.id}
                      className="relative cursor-pointer group"
                      initial={{ opacity: 0, y: 30, rotateY: -15 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ delay: 7 + index * 0.3, duration: 0.8 }}
                      whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                      onClick={() => setSelectedDomain(domain.id)}
                    >
                      {/* Case File Folder */}
                      <div className="relative">
                        <div className="bg-amber-100 border-2 border-amber-300 rounded-lg overflow-hidden shadow-2xl">
                          {/* File Tab */}
                          <div className="bg-amber-200 px-4 py-2 border-b border-amber-300">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-sm font-bold text-gray-800">
                                {caseDetails.caseNumber}
                              </span>
                              <div className="text-xl">{caseDetails.icon}</div>
                            </div>
                          </div>
                          
                          {/* File Content */}
                          <div className="p-4 bg-white">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge 
                                variant="outline" 
                                className={`text-xs font-mono ${
                                  caseDetails.status === 'URGENT' ? 'border-red-500 text-red-600' :
                                  caseDetails.status === 'ACTIVE' ? 'border-orange-500 text-orange-600' :
                                  'border-blue-500 text-blue-600'
                                }`}
                              >
                                {caseDetails.status}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs font-mono ${
                                  caseDetails.priority === 'CRITICAL' ? 'border-red-600 text-red-700' :
                                  caseDetails.priority === 'HIGH' ? 'border-orange-600 text-orange-700' :
                                  'border-gray-600 text-gray-700'
                                }`}
                              >
                                {caseDetails.priority}
                              </Badge>
                            </div>
                            
                            <h3 className="font-bold text-gray-800 mb-2 text-sm leading-tight">{domain.title}</h3>
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{domain.description}</p>
                            
                            {/* Evidence Summary */}
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Evidence:</span>
                                <span className="font-mono">{caseDetails.evidence}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Detectives:</span>
                                <span className="font-mono">{domain.topics.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Items:</span>
                                <span className="font-mono">{domain.topics.reduce((acc, topic) => acc + topic.content.length, 0)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Red String Connections */}
                        {index < filteredDomains.length - 1 && (
                          <motion.div
                            className="absolute top-1/2 -right-3 w-6 h-px bg-red-500 z-10"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 8 + index * 0.3, duration: 0.5 }}
                          />
                        )}

                        {/* Evidence pins */}
                        {domain.topics.slice(0, 3).map((topic, topicIndex) => {
                          const pinPos = getDetectivePosition(topicIndex, Math.min(domain.topics.length, 3));
                          
                          return (
                            <motion.div
                              key={topic.id}
                              className="absolute w-2 h-2 bg-red-500 rounded-full border border-red-700"
                              style={{
                                left: pinPos.x / 4 + '50%',
                                top: pinPos.y / 4 + '50%',
                              }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ 
                                delay: 8.5 + index * 0.3 + topicIndex * 0.1,
                                type: "spring",
                                stiffness: 400
                              }}
                            />
                          );
                        })}
                      </div>

                      {/* Case briefing hover */}
                      <motion.div
                        className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
                        initial={false}
                      >
                        <div className="bg-black/90 text-white px-4 py-3 rounded-lg text-center min-w-max border border-yellow-400/50 backdrop-blur-sm">
                          <p className="text-xs text-yellow-300 font-mono mb-1">CASE BRIEFING</p>
                          <h3 className="font-bold text-sm mb-1">{domain.title}</h3>
                          <p className="text-xs text-gray-300">Click to examine evidence</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Investigation Tools */}
              <motion.div
                className="border-t border-yellow-400/30 pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 9 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-yellow-300">
                      <span className="text-2xl">🔍</span>
                      <span className="font-mono text-sm">EVIDENCE SCANNER</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <span className="text-2xl">🧬</span>
                      <span className="font-mono text-sm">DATA ANALYZER</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400">
                      <span className="text-2xl">🔗</span>
                      <span className="font-mono text-sm">CONNECTION MAPPER</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-mono text-xs text-gray-400">CLEARANCE LEVEL: ALPHA</p>
                    <p className="font-mono text-xs text-gray-400">INVESTIGATOR: ACTIVE</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Evidence Classification Legend */}
        <motion.div 
          className="fixed bottom-6 left-6 bg-black/80 backdrop-blur-sm border border-yellow-400/50 rounded-lg p-4 text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 10 }}
        >
          <h3 className="font-mono font-bold mb-3 text-yellow-300 flex items-center gap-2">
            📂 EVIDENCE TYPES
          </h3>
          <div className="space-y-2 text-sm font-mono">
            {[
              { type: 'CASE FILE', icon: '📋', desc: 'Documented Evidence' },
              { type: 'AUDIO', icon: '🎧', desc: 'Recorded Testimony' },
              { type: 'SURVEILLANCE', icon: '📹', desc: 'Visual Evidence' },
              { type: 'PROTOCOL', icon: '📝', desc: 'Investigation Procedures' },
            ].map(({ type, icon, desc }) => (
              <div key={type} className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <div>
                  <span className="text-yellow-300">{type}:</span>
                  <span className="text-gray-300 ml-2">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Case Investigation Room (Domain Selected)
  if (selectedDomain && !selectedTopic) {
    const domain = filteredDomains.find(d => d.id === selectedDomain)!;
    const caseDetails = getCaseDetails(domain.title);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 relative overflow-hidden">
        {/* Investigation Room Lighting */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        {/* Breadcrumb */}
        <div className="pt-8 pb-6 px-8 flex items-center gap-2 text-sm text-gray-300 relative z-10 font-mono">
          <motion.button 
            onClick={resetView} 
            className="hover:text-yellow-300 transition-colors flex items-center gap-1 bg-black/50 px-3 py-1 rounded border border-yellow-400/30"
            whileHover={{ x: -2 }}
          >
            ← BUREAU
          </motion.button>
          <span>/</span>
          <span className="text-yellow-300 font-bold">{caseDetails.caseNumber}</span>
        </div>

        {/* Case Header */}
        <motion.div 
          className="text-center mb-12 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            {caseDetails.icon}
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-2 font-mono">{caseDetails.caseNumber}</h1>
          <h2 className="text-3xl text-yellow-300 mb-4">{domain.title}</h2>
          <p className="text-xl text-gray-300 italic mb-4">{domain.description}</p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className={`text-lg px-4 py-2 font-mono ${
              caseDetails.status === 'URGENT' ? 'border-red-500 text-red-400' :
              caseDetails.status === 'ACTIVE' ? 'border-orange-500 text-orange-400' :
              'border-blue-500 text-blue-400'
            }`}>
              STATUS: {caseDetails.status}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 font-mono text-yellow-300 border-yellow-400">
              {domain.topics.length} DETECTIVES • {domain.topics.reduce((acc, topic) => acc + topic.content.length, 0)} EVIDENCE
            </Badge>
          </div>
        </motion.div>

        {/* Detective Team */}
        <div className="relative max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domain.topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                className="relative"
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: index * 0.2, type: "spring" }}
              >
                <motion.div
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6 relative">
                      {/* Detective Badge */}
                      <div className="relative mb-6">
                        <motion.div
                          className={`w-20 h-20 bg-gradient-to-br ${caseDetails.color} rounded-full flex items-center justify-center text-3xl border-4 border-yellow-400/50 shadow-lg mx-auto`}
                          animate={{
                            boxShadow: [
                              "0 0 20px rgba(255, 255, 0, 0.3)",
                              "0 0 30px rgba(255, 255, 0, 0.5)",
                              "0 0 20px rgba(255, 255, 0, 0.3)"
                            ]
                          }}
                          transition={{
                            duration: 2 + index * 0.3,
                            repeat: Infinity,
                          }}
                        >
                          🕵️
                        </motion.div>

                        {/* Detective ID */}
                        <motion.div
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm text-white font-bold font-mono"
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </motion.div>

                        {/* Evidence Count */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-yellow-300 px-2 py-1 rounded text-xs font-mono border border-yellow-400/50">
                          {topic.content.length} EVIDENCE
                        </div>
                      </div>

                      {/* Detective Info */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-yellow-300 mb-2 font-mono">{topic.title}</h3>
                        <p className="text-gray-300 text-sm mb-4">{topic.description}</p>
                      </div>

                      {/* Evidence Types */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {['wiki', 'podcast', 'video', 'guide'].map((type) => {
                          const hasEvidence = topic.content.some(c => c.type === type);
                          const evidenceType = getEvidenceType(type as ContentPiece['type']);
                          
                          return (
                            <div
                              key={type}
                              className={`p-2 rounded border transition-all text-center font-mono text-xs ${
                                hasEvidence 
                                  ? 'bg-yellow-400/10 border-yellow-400/50 text-yellow-300' 
                                  : 'bg-gray-700/50 border-gray-600/50 text-gray-500'
                              }`}
                            >
                              <div className="text-lg mb-1">{evidenceType.icon}</div>
                              <div className="font-bold">{evidenceType.classification}</div>
                            </div>
                          );
                        })}
                      </div>

                      <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-mono font-bold">
                        EXAMINE EVIDENCE →
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

  // Evidence Room (Topic Selected)
  if (selectedDomain && selectedTopic) {
    const domain = filteredDomains.find(d => d.id === selectedDomain)!;
    const topic = domain.topics.find(t => t.id === selectedTopic)!;
    const caseDetails = getCaseDetails(domain.title);

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black relative overflow-hidden">
        {/* Breadcrumb */}
        <div className="pt-8 pb-6 px-8 flex items-center gap-2 text-sm text-gray-300 relative z-10 font-mono">
          <motion.button 
            onClick={resetView} 
            className="hover:text-yellow-300 transition-colors bg-black/50 px-3 py-1 rounded border border-yellow-400/30"
            whileHover={{ x: -2 }}
          >
            ← BUREAU
          </motion.button>
          <span>/</span>
          <motion.button 
            onClick={() => setSelectedTopic(null)} 
            className="hover:text-yellow-300 transition-colors bg-black/50 px-3 py-1 rounded border border-yellow-400/30"
            whileHover={{ x: -2 }}
          >
            {caseDetails.caseNumber}
          </motion.button>
          <span>/</span>
          <span className="text-yellow-300 font-bold">DETECTIVE {topic.title.toUpperCase()}</span>
        </div>

        {/* Detective Header */}
        <motion.div 
          className="text-center mb-8 px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className={`w-16 h-16 bg-gradient-to-br ${caseDetails.color} rounded-full flex items-center justify-center text-3xl border-4 border-yellow-400/50 shadow-lg`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🕵️
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-yellow-300 mb-2 font-mono">DETECTIVE {topic.title.toUpperCase()}</h1>
          <p className="text-xl text-gray-300 italic mb-4">{topic.description}</p>
          <Badge variant="outline" className="text-yellow-300 border-yellow-400 bg-black/50 font-mono">
            EVIDENCE COLLECTION: {topic.content.length} ITEMS
          </Badge>
        </motion.div>

        {/* Evidence Board */}
        <div className="relative max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {topic.content.map((content, index) => (
              <motion.div
                key={content.id}
                className="relative"
                initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <motion.div
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.02, y: -4, rotateX: 2 }}
                  onClick={() => handleContentClick(content, topic, domain)}
                >
                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-red-400 hover:border-red-500 transition-all duration-300 overflow-hidden shadow-xl">
                    <CardContent className="p-6 relative">
                      {/* Evidence tape */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-yellow-400 text-black flex items-center justify-center font-mono text-xs font-bold">
                        ⚠️ EVIDENCE - DO NOT TAMPER ⚠️
                      </div>

                      {/* Evidence Details */}
                      <div className="mt-8 relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-12 h-12 bg-gradient-to-br ${caseDetails.color} rounded border-2 border-red-400 flex items-center justify-center text-xl text-white`}>
                              {getEvidenceType(content.type).icon}
                            </div>
                            <div className="flex-1">
                              <Badge variant="outline" className="text-red-600 border-red-400 mb-1 font-mono text-xs">
                                {getEvidenceType(content.type).type}
                              </Badge>
                              <h3 className="font-bold text-gray-800 leading-tight">{content.title}</h3>
                            </div>
                          </div>
                          <motion.div
                            className="text-2xl"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, delay: index }}
                          >
                            📎
                          </motion.div>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-4 leading-relaxed">{content.description}</p>
                        
                        {/* Evidence Metadata */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-xs bg-red-50 p-3 rounded border border-red-200 font-mono">
                          <div>
                            <span className="font-bold text-red-700">COLLECTED BY:</span>
                            <p className="text-gray-800">{content.author}</p>
                          </div>
                          <div>
                            <span className="font-bold text-red-700">TIMESTAMP:</span>
                            <p className="text-gray-800">{content.publishedAt}</p>
                          </div>
                          <div>
                            <span className="font-bold text-red-700">DURATION:</span>
                            <p className="text-gray-800">{content.readTime || content.duration}</p>
                          </div>
                          <div>
                            <span className="font-bold text-red-700">CLASSIFICATION:</span>
                            <p className="text-gray-800">{getEvidenceType(content.type).classification}</p>
                          </div>
                        </div>
                        
                        {/* Evidence Tags */}
                        <div className="mb-4">
                          <p className="text-xs font-bold text-red-700 mb-2 font-mono">EVIDENCE TAGS:</p>
                          <div className="flex flex-wrap gap-1">
                            {content.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-red-700 border-red-300 text-xs font-mono">
                                #{tag.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-mono">
                          <span className="mr-2">🔍</span>
                          {content.type === 'wiki' || content.type === 'guide' ? 'EXAMINE DOCUMENT' : 
                           content.type === 'podcast' ? 'PLAY RECORDING' : 'VIEW SURVEILLANCE'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Evidence Analyzer */}
        <AnimatePresence>
          {selectedContent && (
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEvidenceViewer}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-yellow-400 shadow-2xl"
                initial={{ scale: 0.8, opacity: 0, rotateX: -10 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateX: -10 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Evidence Analyzer Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-yellow-400">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${caseDetails.color} rounded border-4 border-yellow-400 flex items-center justify-center text-2xl text-white`}>
                      {getEvidenceType(selectedContent.content.type).icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-yellow-300 font-mono">{selectedContent.content.title}</h2>
                      <p className="text-gray-300 font-mono">Evidence analyzed by Detective {selectedContent.topic.title}</p>
                      <Badge variant="outline" className="mt-1 text-yellow-300 border-yellow-400 font-mono">
                        {getEvidenceType(selectedContent.content.type).type} • {getEvidenceType(selectedContent.content.type).classification}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" onClick={closeEvidenceViewer} className="border-yellow-400 text-yellow-300 hover:bg-yellow-400/10 font-mono">
                    ✕ CLOSE
                  </Button>
                </div>

                {/* Evidence Scanner */}
                <div className="bg-yellow-400/10 rounded-xl p-4 mb-6 border-2 border-yellow-400/50">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl">🔬</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-yellow-300 mb-1 font-mono">
                        <span>EVIDENCE ANALYSIS</span>
                        <span>{evidenceScanning ? 'SCANNING...' : 'READY'} • {selectedContent.content.readTime || selectedContent.content.duration}</span>
                      </div>
                      <div className="w-full bg-yellow-400/20 rounded-full h-3 border border-yellow-400/50">
                        <motion.div
                          className="bg-gradient-to-r from-yellow-400 to-red-500 h-3 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: evidenceScanning ? "100%" : "0%" }}
                          transition={{ duration: 2 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Content */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2 font-mono">
                    📋 EVIDENCE ANALYSIS REPORT
                  </h3>
                  <div className="bg-gradient-to-r from-gray-800/50 to-slate-800/50 p-6 rounded-xl border-2 border-gray-600">
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">{selectedContent.content.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/50 p-4 rounded-lg border border-yellow-400/30">
                        <h4 className="font-bold text-yellow-300 mb-2 font-mono">🔍 INVESTIGATION NOTES:</h4>
                        <p className="text-sm text-gray-300">
                          This {getEvidenceType(selectedContent.content.type).classification.toLowerCase()} evidence provides crucial insights 
                          into {selectedContent.topic.title.toLowerCase()} investigation protocols within the {selectedContent.domain.title} case.
                        </p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-yellow-400/30">
                        <h4 className="font-bold text-yellow-300 mb-2 font-mono">🏷️ EVIDENCE TAGS:</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedContent.content.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-yellow-300 border-yellow-400/50 text-xs font-mono">
                              #{tag.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investigation Action */}
                <div className="text-center">
                  <Button 
                    onClick={() => {
                      closeEvidenceViewer();
                      onContentSelect(selectedContent.content, selectedContent.topic, selectedContent.domain);
                    }}
                    className="bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-black px-8 py-4 text-lg rounded-xl font-mono font-bold"
                  >
                    <span className="mr-3">🔍</span>
                    CONDUCT FULL INVESTIGATION
                    <span className="ml-3">📋</span>
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-8xl mb-6">🚫</div>
          <h3 className="text-3xl font-bold text-yellow-300 mb-4 font-mono">NO EVIDENCE FOUND</h3>
          <p className="text-gray-300 max-w-md mx-auto text-lg">
            Your search parameters didn't match any cases, detectives, or evidence. Try different keywords or return to the investigation bureau.
          </p>
          <motion.button
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-black rounded-xl hover:from-yellow-600 hover:to-red-600 transition-colors font-mono font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RETURN TO BUREAU
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return null;
}