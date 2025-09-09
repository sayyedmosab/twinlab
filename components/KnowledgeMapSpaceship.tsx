import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Domain, Topic, ContentPiece } from '../types';

interface KnowledgeMapSpaceshipProps {
  domains: Domain[];
  onContentSelect: (content: ContentPiece, topic: Topic, domain: Domain) => void;
  searchQuery: string;
}

export function KnowledgeMapSpaceship({ domains, onContentSelect, searchQuery }: KnowledgeMapSpaceshipProps) {
  const [hoveredContent, setHoveredContent] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<{
    content: ContentPiece;
    topic: Topic;
    domain: Domain;
  } | null>(null);

  // Podcast state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(45);
  const [duration] = useState(180);
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [language, setLanguage] = useState('en');

  // Video state
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [quality, setQuality] = useState('1080p');
  const [audioLang, setAudioLang] = useState('en');

  // Wiki state
  const [isEditing, setIsEditing] = useState(false);
  const [wikiContent, setWikiContent] = useState('');

  // Study guide state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Reset state when content changes
  React.useEffect(() => {
    if (selectedContent) {
      // Reset all content-specific state when switching content
      setIsPlaying(false);
      setCurrentTime(45);
      setPlaybackSpeed('1');
      setLanguage('en');
      setVideoPlaying(false);
      setShowCaptions(true);
      setQuality('1080p');
      setAudioLang('en');
      setIsEditing(false);
      setWikiContent(selectedContent.content.description);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  }, [selectedContent]);

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

  const getDomainColor = (index: number) => {
    const colors = [
      'from-purple-300 to-purple-500',
      'from-purple-400 to-purple-600', 
      'from-purple-500 to-purple-700',
      'from-purple-600 to-purple-800'
    ];
    return colors[index % colors.length];
  };

  const getContentTypeInfo = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return { icon: '■', label: 'Wiki Read' };
      case 'podcast': return { icon: '▶', label: 'Podcast Discussion' };
      case 'video': return { icon: '▣', label: 'Video Presentation' };
      case 'guide': return { icon: '≡', label: 'Study Guide' };
    }
  };

  const renderPodcastContent = (content: ContentPiece) => {

    return (
      <div className="space-y-6">
        {/* Episode Art & Info */}
        <div className="flex gap-6">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-4xl text-white font-bold border border-cyan-400/30">
            EP
          </div>
          <div className="flex-1 space-y-3">
            <h4 className="text-xl font-bold text-purple-600 font-inter">{content.title}</h4>
            <p className="text-gray-700 font-inter">{content.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600 font-inter">
              <span>Duration: {content.duration}</span>
              <span>•</span>
              <span>Released: March 15, 2024</span>
              <span>•</span>
              <span>Host: {content.author}</span>
            </div>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="bg-gray-100 border border-gray-300 p-4 space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 flex items-center justify-center text-white transition-colors"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <div className="flex-1">
              <div className="w-full bg-gray-300 h-2 relative">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-600" 
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1 font-inter">
                <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
                <span>{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-inter">Speed:</span>
              <select 
                value={playbackSpeed} 
                onChange={(e) => setPlaybackSpeed(e.target.value)}
                className="w-20 h-8 bg-white border border-gray-400 text-gray-800 text-sm px-2"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-inter">Language:</span>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="w-28 h-8 bg-white border border-gray-400 text-gray-800 text-sm px-2"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        {/* Episode Content */}
        <div className="space-y-4 text-gray-700 font-inter">
          <h5 className="text-lg font-bold text-purple-600">Episode Notes</h5>
          <p>In this episode, we dive deep into the fundamental concepts of organizational transformation through digital twin methodologies...</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Understanding digital twin frameworks for organizations</li>
            <li>Key metrics and KPIs for transformation success</li>
            <li>Common pitfalls and how to avoid them</li>
            <li>Real-world case studies from industry leaders</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderVideoContent = (content: ContentPiece) => {

    return (
      <div className="space-y-6">
        {/* Video Player */}
        <div className="bg-black border-2 border-cyan-400/30 aspect-video flex items-center justify-center relative">
          <div className="text-6xl text-gray-600">📹</div>
          {!videoPlaying && (
            <button
              onClick={() => setVideoPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-colors"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 flex items-center justify-center text-white text-2xl transition-colors">
                ▶
              </div>
            </button>
          )}
        </div>

        {/* Video Controls */}
        <div className="bg-gray-100 border border-gray-300 p-4 space-y-4">
          <div className="flex items-center gap-4">
            <h4 className="text-xl font-bold text-purple-600 font-inter flex-1">{content.title}</h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`px-3 py-1 text-sm border transition-colors font-inter ${
                  showCaptions 
                    ? 'bg-purple-600 text-white border-purple-600' 
                    : 'bg-transparent text-purple-600 border-purple-600/50 hover:border-purple-600'
                }`}
              >
                CC
              </button>
              <select 
                value={quality} 
                onChange={(e) => setQuality(e.target.value)}
                className="w-20 h-8 bg-white border border-gray-400 text-gray-800 text-sm px-2"
              >
                <option value="480p">480p</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
              <select 
                value={audioLang} 
                onChange={(e) => setAudioLang(e.target.value)}
                className="w-28 h-8 bg-white border border-gray-400 text-gray-800 text-sm px-2"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          <div className="text-gray-700 font-inter">
            <p className="mb-4">{content.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-purple-600 font-bold">Presenter:</span> {content.author}
              </div>
              <div>
                <span className="text-purple-600 font-bold">Duration:</span> {content.duration}
              </div>
              <div>
                <span className="text-purple-600 font-bold">Level:</span> Intermediate
              </div>
              <div>
                <span className="text-purple-600 font-bold">Format:</span> Video Presentation
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWikiContent = (content: ContentPiece) => {

    return (
      <div className="space-y-6">
        {/* Wiki Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-300">
          <h4 className="text-xl font-bold text-purple-600 font-inter">{content.title}</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-inter">Last edited by {content.author}</span>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-purple-600/50 text-purple-600 hover:bg-purple-600/10 text-sm font-inter transition-colors"
            >
              {isEditing ? 'Save' : 'Suggest Edit'}
            </button>
          </div>
        </div>

        {/* Wiki Content */}
        <div className="space-y-4">
          {isEditing ? (
            <textarea
              value={wikiContent || content.description}
              onChange={(e) => setWikiContent(e.target.value)}
              className="w-full h-64 bg-gray-50 border border-gray-300 p-4 text-gray-800 font-inter resize-none"
              placeholder="Edit wiki content..."
            />
          ) : (
            <div className="prose max-w-none">
              <div className="space-y-4 text-gray-700 font-inter leading-relaxed">
                <h5 className="text-lg font-bold text-purple-600">Overview</h5>
                <p>{content.description}</p>
                
                <h5 className="text-lg font-bold text-purple-600">Key Concepts</h5>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Digital Twin Framework:</strong> A comprehensive approach to modeling organizational systems</li>
                  <li><strong>Transformation Metrics:</strong> KPIs that measure organizational change effectiveness</li>
                  <li><strong>Change Architecture:</strong> Structured approach to implementing transformation</li>
                  <li><strong>Governance Models:</strong> Framework for decision-making and accountability</li>
                </ul>

                <h5 className="text-lg font-bold text-purple-600">Implementation Steps</h5>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Assess current organizational state</li>
                  <li>Define transformation objectives</li>
                  <li>Design digital twin architecture</li>
                  <li>Implement monitoring systems</li>
                  <li>Execute transformation plan</li>
                  <li>Measure and optimize results</li>
                </ol>

                <h5 className="text-lg font-bold text-purple-600">References</h5>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-gray-600">
                  <li>Organizational Transformation Handbook (2024)</li>
                  <li>Digital Twin Methodologies in Practice</li>
                  <li>Change Management Best Practices</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Wiki Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-300">
          <button className="px-4 py-2 border border-purple-600/50 text-purple-600 hover:bg-purple-600/10 text-sm font-inter transition-colors">
            View History
          </button>
          <button className="px-4 py-2 border border-purple-600/50 text-purple-600 hover:bg-purple-600/10 text-sm font-inter transition-colors">
            Discussion
          </button>
          <button className="px-4 py-2 border border-purple-600/50 text-purple-600 hover:bg-purple-600/10 text-sm font-inter transition-colors">
            Export PDF
          </button>
        </div>
      </div>
    );
  };

  const renderStudyGuideContent = (content: ContentPiece) => {

    const questions = [
      {
        question: "What is the primary goal of organizational transformation?",
        options: [
          "Increase revenue",
          "Improve operational efficiency and adaptability",
          "Reduce costs",
          "Expand market presence"
        ],
        correct: 1
      },
      {
        question: "Which component is essential for digital twin implementation?",
        options: [
          "Data collection systems",
          "AI algorithms",
          "Governance framework",
          "All of the above"
        ],
        correct: 3
      }
    ];

    return (
      <div className="space-y-6">
        {/* Study Guide Header */}
        <div className="pb-4 border-b border-gray-300">
          <h4 className="text-xl font-bold text-purple-600 font-inter">{content.title}</h4>
          <p className="text-gray-600 font-inter">Interactive learning with self-assessment</p>
        </div>

        {/* Learning Objectives */}
        <div className="bg-gray-100 border border-gray-300 p-4">
          <h5 className="text-lg font-bold text-purple-600 mb-3 font-inter">Learning Objectives</h5>
          <ul className="list-disc list-inside space-y-2 text-gray-700 font-inter">
            <li>Understand the core principles of organizational transformation</li>
            <li>Identify key components of digital twin frameworks</li>
            <li>Apply transformation metrics to real-world scenarios</li>
            <li>Develop implementation strategies for your organization</li>
          </ul>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          <h5 className="text-lg font-bold text-purple-600 font-inter">Key Concepts</h5>
          <div className="space-y-3 text-gray-700 font-inter">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold">1</div>
              <p><strong>Strategic Framework:</strong> Establishing clear vision and objectives for transformation</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold">2</div>
              <p><strong>Digital Twin Architecture:</strong> Creating virtual representations of organizational systems</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold">3</div>
              <p><strong>Change Management:</strong> Guiding people through transformation processes</p>
            </div>
          </div>
        </div>

        {/* Interactive Quiz */}
        <div className="bg-gray-100 border border-gray-300 p-4">
          <h5 className="text-lg font-bold text-purple-600 mb-4 font-inter">Self-Assessment Quiz</h5>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-inter">Question {currentQuestion + 1} of {questions.length}</span>
              <div className="w-32 h-2 bg-gray-300 relative">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-700" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            <h6 className="font-bold text-gray-800 font-inter">{questions[currentQuestion].question}</h6>
            
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedAnswer(index);
                    setShowAnswer(true);
                  }}
                  className={`w-full text-left p-3 border transition-colors font-inter ${
                    showAnswer
                      ? index === questions[currentQuestion].correct
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : index === selectedAnswer && index !== questions[currentQuestion].correct
                        ? 'bg-red-100 border-red-400 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-purple-400'
                  }`}
                  disabled={showAnswer}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>

            {showAnswer && (
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => {
                    if (currentQuestion < questions.length - 1) {
                      setCurrentQuestion(currentQuestion + 1);
                      setSelectedAnswer(null);
                      setShowAnswer(false);
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-inter transition-colors disabled:opacity-50"
                  disabled={currentQuestion === questions.length - 1}
                >
                  Next Question
                </button>
                <span className="text-sm text-gray-600 font-inter">
                  {selectedAnswer === questions[currentQuestion].correct ? '✅ Correct!' : '❌ Try again next time'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Chapter and Episode Names
  const chapterNames = [
    "The Mechanics of Transformation",
    "The Architectural Blueprint in Practice", 
    "The Management Operating System",
    "An Open-Source Toolkit for Your First 90 Days"
  ];

  const episodeNames = [
    [
      "What is an Organizational Transformation?",
      "What is a Sector Transformation?", 
      "What is the People Transformation?",
      "The Entangled Transformation Battleground"
    ],
    [
      "Strategic Performance (KPIs)",
      "Portfolios & Initiatives",
      "Process Architecture", 
      "Organizational Design"
    ],
    [
      "The Integrated Governance",
      "The Delivery Engine",
      "Change Architecture",
      "The Enablers"
    ],
    [
      "Day 1-15: Diagnose Your Starting Point",
      "Day 16-60: Architect Your First \"Golden Thread\"",
      "Day 61-90: Launch Your First GenAI-powered Use Case",
      "" // Only 3 episodes in this chapter
    ]
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Spaceship Frame - Thin Panel Edges - Rusty Silver */}
      <div className="absolute inset-0">


        {/* Left Panel Edge - 5% width with gray background */}
        <div className="absolute top-0 bottom-12 left-0 w-[5%] bg-gradient-to-r from-stone-500/80 to-stone-500/60">
          <div className="w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
          {/* Panel Bolts */}
          <div className="absolute top-4 left-2 w-1 h-1 bg-cyan-400"></div>
          <div className="absolute bottom-4 left-2 w-1 h-1 bg-cyan-400"></div>
        </div>

        {/* Bottom Panel Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-stone-500/80 to-transparent">
          <div className="absolute bottom-0 h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-8 text-xs text-gray-300 font-inter">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400"></div>
                <span>POWER: 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-400"></div>
                <span>COMMS: ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-400"></div>
                <span>AI: ONLINE</span>
              </div>
            </div>
          </div>
          {/* Panel Bolts */}
          <div className="absolute bottom-2 left-4 w-1 h-1 bg-cyan-400"></div>
          <div className="absolute bottom-2 right-4 w-1 h-1 bg-cyan-400"></div>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="absolute top-0 bottom-12 left-[5%] right-0 bg-black/90 p-8 overflow-y-auto backdrop-blur-sm">


        {/* Knowledge Chapters - Vertical Stack */}
        <div className="space-y-8 max-w-full pt-8">
          {filteredDomains.map((domain, domainIndex) => (
            <motion.div
              key={domain.id}
              className="w-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: domainIndex * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-2 border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8">
                  {/* Chapter Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-8 h-8 bg-gradient-to-r ${getDomainColor(domainIndex)} shadow-lg flex items-center justify-center`}>
                      <span className="text-white font-bold font-inter">{domainIndex + 1}</span>
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="text-cyan-300 border-cyan-400/50 text-xs mb-2 font-inter">
                        CHAPTER {domainIndex + 1}
                      </Badge>
                      <h2 className="text-2xl font-bold text-cyan-300 font-inter">
                        {chapterNames[domainIndex]}
                      </h2>
                    </div>
                  </div>

                  {/* Episodes - Single Row with Aligned Heights */}
                  <div className="grid grid-cols-4 gap-6">
                    {domain.topics.map((topic, topicIndex) => (
                      <div key={topic.id} className="flex flex-col">
                        {/* Episode Header - Fixed Height */}
                        <div className="h-20 flex items-start gap-3 mb-4">
                          <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 border border-cyan-400 flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-1">
                            {domainIndex + 1}.{topicIndex + 1}
                          </div>
                          <h3 className="text-lg font-bold text-white font-inter leading-tight flex-1">
                            {episodeNames[domainIndex][topicIndex]}
                          </h3>
                        </div>

                        {/* Knowledge Grid - 4 Content Types Stacked - Fixed Height */}
                        <div className="grid grid-cols-1 gap-2 flex-1">
                          {['wiki', 'podcast', 'video', 'guide'].map((contentType) => {
                            const content = topic.content.find(c => c.type === contentType);
                            const typeInfo = getContentTypeInfo(contentType as ContentPiece['type']);
                            
                            const handleContentClick = () => {
                              if (content) {
                                setSelectedContent({ content, topic, domain });
                                setExpandedChapter(expandedChapter === domain.id ? null : domain.id);
                              }
                            };
                            
                            return (
                              <motion.div
                                key={contentType}
                                className={`group relative h-12 border-2 transition-all duration-300 cursor-pointer ${
                                  content 
                                    ? `bg-gradient-to-r ${getDomainColor(domainIndex)} border-white/60 hover:border-white hover:shadow-lg` 
                                    : 'bg-gray-800/50 border-gray-600/50'
                                }`}
                                whileHover={content ? { scale: 1.02 } : {}}
                                animate={content ? { 
                                  borderColor: [
                                    'rgba(255, 255, 255, 0.6)',
                                    'rgba(255, 255, 255, 0.9)',
                                    'rgba(255, 255, 255, 0.6)'
                                  ]
                                } : {}}
                                transition={content ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                                onClick={handleContentClick}
                                onHoverStart={() => content && setHoveredContent(content.id)}
                                onHoverEnd={() => setHoveredContent(null)}
                              >
                                {/* Content Type Label - Hidden by default, shown on hover */}
                                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                                  content && hoveredContent === content.id ? 'opacity-100' : 'opacity-0'
                                }`}>
                                  <div className="flex items-center gap-2 text-white font-inter font-bold">
                                    <span className="text-lg text-white">{typeInfo.icon}</span>
                                    <span>{typeInfo.label}</span>
                                  </div>
                                </div>

                                {/* Default state - just the gradient */}
                                <div className={`absolute inset-0 transition-opacity duration-200 ${
                                  content && hoveredContent === content.id ? 'opacity-0' : 'opacity-100'
                                }`}>
                                  {content && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60"></div>
                                  )}
                                </div>

                                {/* Scanning Line Effect on Hover */}
                                {content && hoveredContent === content.id && (
                                  <motion.div
                                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  />
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>


                </CardContent>
              </Card>

              {/* Expanded Content Section - Slides up from under THIS chapter */}
              <div className="relative overflow-hidden">
                <AnimatePresence>
                  {expandedChapter === domain.id && selectedContent && (
                    <motion.div
                      className="bg-white border-2 border-cyan-400/30 backdrop-blur-sm mx-[2%]"
                      initial={{ y: '100%', opacity: 1 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: '100%', opacity: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                    <div className="p-8 text-gray-800">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 bg-gradient-to-r ${getDomainColor(domainIndex)} flex items-center justify-center`}>
                            <span className="text-white font-bold text-xs font-inter">{getContentTypeInfo(selectedContent.content.type).icon}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-purple-600 font-inter">
                            {getContentTypeInfo(selectedContent.content.type).label}
                          </h3>
                        </div>
                        <button
                          onClick={() => {
                            setExpandedChapter(null);
                            setSelectedContent(null);
                          }}
                          className="text-gray-600 hover:text-gray-800 transition-colors font-inter text-sm px-4 py-2 border border-gray-400 hover:border-gray-600"
                        >
                          ✕ CLOSE
                        </button>
                      </div>

                      {/* Content-Type Specific Rendering */}
                      {selectedContent.content.type === 'podcast' && renderPodcastContent(selectedContent.content)}
                      {selectedContent.content.type === 'video' && renderVideoContent(selectedContent.content)}
                      {selectedContent.content.type === 'wiki' && renderWikiContent(selectedContent.content)}
                      {selectedContent.content.type === 'guide' && renderStudyGuideContent(selectedContent.content)}

                      {/* Content Tags */}
                      <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-300 mt-6">
                        {selectedContent.content.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300 text-purple-700 text-sm font-inter"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              {/* Scanning Line Effect */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {searchQuery && filteredDomains.length === 0 && (
        <div className="absolute top-16 bottom-16 left-16 right-16 flex items-center justify-center">
          <motion.div 
            className="text-center max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-6 text-cyan-400">🔍</div>
            <h3 className="text-2xl font-bold text-cyan-300 mb-4 font-inter">NO DATA FOUND</h3>
            <p className="text-gray-400 mb-6 font-inter">
              Search parameters returned zero results.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}