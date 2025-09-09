import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Domain, Topic, ContentPiece } from '../types';

interface KnowledgeMapKitchenProps {
  domains: Domain[];
  onContentSelect: (content: ContentPiece, topic: Topic, domain: Domain) => void;
  searchQuery: string;
}

export function KnowledgeMapKitchen({ domains, onContentSelect, searchQuery }: KnowledgeMapKitchenProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<{
    content: ContentPiece;
    topic: Topic;
    domain: Domain;
  } | null>(null);
  const [steamAnimations, setSteamAnimations] = useState<number[]>([]);

  // Steam animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSteamAnimations(prev => [...prev.slice(-10), Date.now()]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const getKitchenStation = (domainTitle: string) => {
    switch (domainTitle.toLowerCase()) {
      case 'modeling & simulation': return { name: 'Prep Station', icon: '🔪', color: 'from-green-400 to-green-600' };
      case 'data integration': return { name: 'Grill Station', icon: '🔥', color: 'from-red-400 to-red-600' };
      case 'iot & sensors': return { name: 'Tech Station', icon: '⚡', color: 'from-blue-400 to-blue-600' };
      case 'visualization': return { name: 'Pastry Station', icon: '🎂', color: 'from-pink-400 to-pink-600' };
      default: return { name: 'Kitchen Station', icon: '👨‍🍳', color: 'from-gray-400 to-gray-600' };
    }
  };

  const getCookingMethod = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return { method: 'Slow-Cooked', icon: '📚', desc: 'Deep, thorough preparation' };
      case 'podcast': return { method: 'Simmered', icon: '🎙️', desc: 'Gently talked through' };
      case 'video': return { method: 'Flambéed', icon: '🎬', desc: 'Visual spectacular' };
      case 'guide': return { method: 'Step-by-Step', icon: '📝', desc: 'Carefully guided recipe' };
    }
  };

  const getDishType = (contentType: ContentPiece['type']) => {
    switch (contentType) {
      case 'wiki': return '🥘'; // Hearty stew
      case 'podcast': return '🍲'; // Soup (fluid conversation)
      case 'video': return '🎂'; // Cake (layered, visual)
      case 'guide': return '📋'; // Recipe card
    }
  };

  const getChefPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 60;
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

  const closeRecipeViewer = () => {
    setSelectedContent(null);
  };

  // Main Kitchen View
  if (!selectedDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
        {/* Kitchen Steam Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {steamAnimations.map((time, i) => (
            <motion.div
              key={time}
              className="absolute text-gray-400 opacity-30"
              style={{
                left: `${20 + (i * 15) % 80}%`,
                bottom: `${10 + (i * 5) % 20}%`,
              }}
              initial={{ y: 0, opacity: 0.3, scale: 0.5 }}
              animate={{ y: -100, opacity: 0, scale: 1.5 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              💨
            </motion.div>
          ))}
        </div>

        {/* Kitchen Ceiling & Lighting */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-amber-800/20 to-transparent">
          <div className="flex justify-center pt-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-8 bg-yellow-400/60 rounded-b-full"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2 + i * 0.5, repeat: Infinity }}
              />
            ))}
          </div>
        </div>

        {/* Kitchen Header */}
        <div className="relative z-10 pt-16 pb-8 text-center">
          <motion.div
            className="inline-block mb-6"
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="text-8xl">👨‍🍳</div>
          </motion.div>
          <motion.h1 
            className="text-6xl font-bold text-amber-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Knowledge Kitchen
          </motion.h1>
          <motion.p 
            className="text-2xl text-amber-700 italic"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Where Information Becomes Nourishing Wisdom
          </motion.p>
        </div>

        {/* Kitchen Island/Counter */}
        <div className="relative max-w-6xl mx-auto px-8">
          <motion.div
            className="relative bg-gradient-to-b from-amber-200 to-amber-300 rounded-t-3xl mx-auto border-4 border-amber-400 shadow-2xl"
            style={{ width: '800px', height: '500px' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Kitchen Stations */}
            {filteredDomains.map((domain, index) => {
              const station = getKitchenStation(domain.title);
              const positions = [
                { x: 150, y: 150, name: 'Left Station' },
                { x: 400, y: 100, name: 'Center Back' },
                { x: 650, y: 150, name: 'Right Station' },
                { x: 400, y: 300, name: 'Front Station' },
              ];
              
              const position = positions[index] || positions[0];

              return (
                <motion.div
                  key={domain.id}
                  className="absolute cursor-pointer group"
                  style={{
                    left: position.x - 80,
                    top: position.y - 60,
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  whileHover={{ scale: 1.1, y: -8 }}
                  onClick={() => setSelectedDomain(domain.id)}
                >
                  {/* Station Counter */}
                  <div className="relative">
                    <div className={`w-32 h-20 bg-gradient-to-b ${station.color} rounded-lg border-2 border-white/50 shadow-lg overflow-hidden`}>
                      {/* Station Equipment */}
                      <div className="absolute inset-2 bg-white/20 rounded flex items-center justify-center">
                        <motion.div 
                          className="text-4xl"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: index === 1 ? [0, 5, -5, 0] : [0, -2, 2, 0]
                          }}
                          transition={{ 
                            duration: 2 + index * 0.3, 
                            repeat: Infinity,
                            delay: index * 0.5 
                          }}
                        >
                          {station.icon}
                        </motion.div>
                      </div>
                      
                      {/* Heat/Activity Lines */}
                      {index === 1 && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-4 bg-red-400/60 rounded-full"
                              style={{ left: (i - 1) * 8 }}
                              animate={{ scaleY: [0.5, 1.5, 0.5], opacity: [0.3, 0.8, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Chefs working at station */}
                    {domain.topics.slice(0, 3).map((topic, topicIndex) => {
                      const chefPos = getChefPosition(topicIndex, Math.min(domain.topics.length, 3));
                      
                      return (
                        <motion.div
                          key={topic.id}
                          className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 border border-white/50"
                          style={{
                            left: chefPos.x + 64,
                            top: chefPos.y + 40,
                          }}
                          animate={{
                            y: [0, -3, 0],
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{
                            duration: 2 + topicIndex * 0.3,
                            repeat: Infinity,
                            delay: topicIndex * 0.4,
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center text-xs">
                            👨‍🍳
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Station Name Badge */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {station.name}
                    </div>
                  </div>

                  {/* Station Info Card */}
                  <motion.div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
                    initial={false}
                  >
                    <div className="bg-white/95 backdrop-blur-sm border-2 border-amber-200 rounded-xl p-4 text-center min-w-max shadow-xl">
                      <h3 className="font-bold text-amber-900 mb-1">{domain.title}</h3>
                      <p className="text-sm text-amber-700 mb-2">{domain.description}</p>
                      <div className="flex items-center justify-center gap-2 text-xs text-amber-600">
                        <span>👨‍🍳 {domain.topics.length} Chefs</span>
                        <span>•</span>
                        <span>🍽️ {domain.topics.reduce((acc, topic) => acc + topic.content.length, 0)} Recipes</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Kitchen Tools on Counter */}
            <motion.div
              className="absolute bottom-4 left-8 flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {['🔪', '🥄', '🍳', '⏲️'].map((tool, i) => (
                <motion.div
                  key={i}
                  className="text-2xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.3 }}
                >
                  {tool}
                </motion.div>
              ))}
            </motion.div>

            {/* Ingredients on Counter */}
            <motion.div
              className="absolute bottom-4 right-8 flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
            >
              {['🥕', '🧄', '🌿', '🧂'].map((ingredient, i) => (
                <motion.div
                  key={i}
                  className="text-xl"
                  animate={{ 
                    y: [0, -2, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2 + i * 0.5, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                >
                  {ingredient}
                </motion.div>
              ))}
            </motion.div>

            {/* Head Chef Position */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl border-4 border-white/50 shadow-lg"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(255, 193, 7, 0.3)",
                    "0 0 40px rgba(255, 193, 7, 0.6)",
                    "0 0 20px rgba(255, 193, 7, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                👑
              </motion.div>
              <p className="text-center text-amber-800 font-bold text-sm mt-2">Head Chef</p>
            </motion.div>
          </motion.div>

          {/* Kitchen Floor Pattern */}
          <motion.div
            className="mt-4 mx-auto bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 h-16 rounded-b-3xl border-x-4 border-b-4 border-amber-400"
            style={{ width: '800px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex justify-center items-center h-full gap-8 text-amber-600">
              <span className="italic">Click any station to meet the chefs</span>
            </div>
          </motion.div>
        </div>

        {/* Recipe Categories Legend */}
        <motion.div 
          className="fixed bottom-6 left-6 bg-white/95 backdrop-blur-sm border-2 border-amber-200 rounded-xl p-4 text-amber-900 shadow-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5 }}
        >
          <h3 className="font-bold mb-3 flex items-center gap-2">
            📖 Cooking Methods
          </h3>
          <div className="space-y-2 text-sm">
            {[
              { type: 'wiki', method: 'Slow-Cooked', icon: '🥘', desc: 'Deep knowledge preparation' },
              { type: 'podcast', method: 'Simmered', icon: '🎙️', desc: 'Gently talked through' },
              { type: 'video', method: 'Flambéed', icon: '🎬', desc: 'Visual spectacular' },
              { type: 'guide', method: 'Step-by-Step', icon: '📝', desc: 'Carefully guided recipe' },
            ].map(({ method, icon, desc }) => (
              <div key={method} className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <div>
                  <span className="font-semibold text-amber-800">{method}:</span>
                  <span className="text-amber-600 ml-2">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Kitchen Station View (Domain Selected)
  if (selectedDomain && !selectedTopic) {
    const domain = filteredDomains.find(d => d.id === selectedDomain)!;
    const station = getKitchenStation(domain.title);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        {/* Station Steam */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl text-gray-400"
              style={{
                left: `${10 + i * 20}%`,
                bottom: `10%`,
              }}
              animate={{
                y: [0, -200],
                opacity: [0.2, 0.6, 0],
                scale: [0.5, 1.2, 1.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.8,
              }}
            >
              💨
            </motion.div>
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="pt-8 pb-6 px-8 flex items-center gap-2 text-sm text-amber-600 relative z-10">
          <motion.button 
            onClick={resetView} 
            className="hover:text-amber-900 transition-colors flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full"
            whileHover={{ x: -2 }}
          >
            ← Kitchen
          </motion.button>
          <span>/</span>
          <span className="text-amber-900 font-semibold">{station.name}</span>
        </div>

        {/* Station Header */}
        <motion.div 
          className="text-center mb-12 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {station.icon}
          </motion.div>
          <h1 className="text-5xl font-bold text-amber-900 mb-4">{domain.title}</h1>
          <p className="text-xl text-amber-700 italic mb-4">{domain.description}</p>
          <Badge variant="outline" className="text-amber-800 border-amber-300 bg-white/50 text-lg px-4 py-2">
            {domain.topics.length} Chefs • {domain.topics.reduce((acc, topic) => acc + topic.content.length, 0)} Recipes
          </Badge>
        </motion.div>

        {/* Chef Stations */}
        <div className="relative max-w-6xl mx-auto px-8">
          <div className={`grid gap-8 ${domain.topics.length === 1 ? 'grid-cols-1 justify-items-center' : domain.topics.length === 2 ? 'grid-cols-2' : domain.topics.length === 3 ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-2'}`}>
            {domain.topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                className="relative max-w-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, type: "spring" }}
              >
                <motion.div
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -8 }}
                  onClick={() => setSelectedTopic(topic.id)}
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Card className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 overflow-hidden shadow-xl">
                    <CardContent className="p-6 relative">
                      {/* Chef Avatar */}
                      <div className="relative mb-6">
                        <motion.div
                          className={`w-20 h-20 bg-gradient-to-br ${station.color} rounded-full flex items-center justify-center text-3xl border-4 border-white/80 shadow-lg mx-auto`}
                          animate={{
                            boxShadow: [
                              "0 0 20px rgba(255, 193, 7, 0.3)",
                              "0 0 30px rgba(255, 193, 7, 0.5)",
                              "0 0 20px rgba(255, 193, 7, 0.3)"
                            ]
                          }}
                          transition={{
                            duration: 2 + index * 0.3,
                            repeat: Infinity,
                          }}
                        >
                          👨‍🍳
                        </motion.div>

                        {/* Chef Hat */}
                        <motion.div
                          className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl"
                          animate={{ rotate: [-5, 5, -5] }}
                          transition={{ duration: 4, repeat: Infinity, delay: index }}
                        >
                          🎩
                        </motion.div>

                        {/* Recipe Count Badge */}
                        <motion.div
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm text-white font-bold"
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                        >
                          {topic.content.length}
                        </motion.div>
                      </div>

                      {/* Chef Info */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-amber-900 mb-2">{topic.title}</h3>
                        <p className="text-amber-700 text-sm mb-4">{topic.description}</p>
                      </div>

                      {/* Recipe Types */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {['wiki', 'podcast', 'video', 'guide'].map((type) => {
                          const hasRecipe = topic.content.some(c => c.type === type);
                          const cookingMethod = getCookingMethod(type as ContentPiece['type']);
                          
                          return (
                            <div
                              key={type}
                              className={`p-2 rounded border-2 transition-all text-center ${
                                hasRecipe 
                                  ? 'bg-amber-100 border-amber-300 hover:bg-amber-200' 
                                  : 'bg-gray-100 border-gray-300 opacity-50'
                              }`}
                            >
                              <div className="text-lg mb-1">{cookingMethod.icon}</div>
                              <div className="text-xs font-semibold text-amber-800">
                                {cookingMethod.method}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Specialties */}
                      <div className="text-center">
                        <Badge variant="outline" className="text-amber-700 border-amber-300 mb-2">
                          Specializes in {topic.content.length} recipes
                        </Badge>
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                          View Recipe Book →
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

  // Chef's Recipe Book (Topic Selected)
  if (selectedDomain && selectedTopic) {
    const domain = filteredDomains.find(d => d.id === selectedDomain)!;
    const topic = domain.topics.find(t => t.id === selectedTopic)!;
    const station = getKitchenStation(domain.title);

    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-amber-50 relative overflow-hidden">
        {/* Breadcrumb */}
        <div className="pt-8 pb-6 px-8 flex items-center gap-2 text-sm text-amber-600 relative z-10">
          <motion.button 
            onClick={resetView} 
            className="hover:text-amber-900 transition-colors bg-white/50 px-3 py-1 rounded-full"
            whileHover={{ x: -2 }}
          >
            ← Kitchen
          </motion.button>
          <span>/</span>
          <motion.button 
            onClick={() => setSelectedTopic(null)} 
            className="hover:text-amber-900 transition-colors bg-white/50 px-3 py-1 rounded-full"
            whileHover={{ x: -2 }}
          >
            {station.name}
          </motion.button>
          <span>/</span>
          <span className="text-amber-900 font-semibold">{topic.title}'s Recipes</span>
        </div>

        {/* Chef Header */}
        <motion.div 
          className="text-center mb-8 px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className={`w-16 h-16 bg-gradient-to-br ${station.color} rounded-full flex items-center justify-center text-3xl border-4 border-white/80 shadow-lg`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              👨‍🍳
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-2">{topic.title}</h1>
          <p className="text-xl text-amber-700 italic mb-4">{topic.description}</p>
          <Badge variant="outline" className="text-amber-800 border-amber-300 bg-white/50">
            Recipe Collection: {topic.content.length} Signature Dishes
          </Badge>
        </motion.div>

        {/* Recipe Cards */}
        <div className="relative max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  whileHover={{ scale: 1.02, y: -4, rotateY: 2 }}
                  onClick={() => handleContentClick(content, topic, domain)}
                >
                  <Card className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 hover:border-orange-400 transition-all duration-300 overflow-hidden shadow-lg">
                    <CardContent className="p-6 relative">
                      {/* Recipe Card Background Pattern */}
                      <div className="absolute top-4 right-4 opacity-10 text-6xl">
                        {getDishType(content.type)}
                      </div>

                      {/* Recipe Header */}
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-12 h-12 bg-gradient-to-br ${station.color} rounded-full flex items-center justify-center text-xl text-white`}>
                              {getCookingMethod(content.type).icon}
                            </div>
                            <div className="flex-1">
                              <Badge variant="outline" className="text-orange-600 border-orange-300 mb-1">
                                {getCookingMethod(content.type).method}
                              </Badge>
                              <h3 className="font-bold text-amber-900 leading-tight">{content.title}</h3>
                            </div>
                          </div>
                          <motion.div
                            className="text-3xl"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, delay: index }}
                          >
                            {getDishType(content.type)}
                          </motion.div>
                        </div>
                        
                        <p className="text-amber-700 text-sm mb-4 leading-relaxed">{content.description}</p>
                        
                        {/* Recipe Details */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-xs bg-orange-50 p-3 rounded-lg">
                          <div>
                            <span className="font-semibold text-orange-700">Chef:</span>
                            <p className="text-amber-800">{content.author}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-orange-700">Prep Time:</span>
                            <p className="text-amber-800">{content.readTime || content.duration}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-orange-700">Created:</span>
                            <p className="text-amber-800">{content.publishedAt}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-orange-700">Method:</span>
                            <p className="text-amber-800">{getCookingMethod(content.type).method}</p>
                          </div>
                        </div>
                        
                        {/* Ingredients (Tags) */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-orange-700 mb-2">Key Ingredients:</p>
                          <div className="flex flex-wrap gap-1">
                            {content.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-amber-700 border-amber-200 text-xs">
                                🌿 {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                          <span className="mr-2">👨‍🍳</span>
                          {content.type === 'wiki' || content.type === 'guide' ? 'Read Recipe' : 
                           content.type === 'podcast' ? 'Listen to Tutorial' : 'Watch Cooking Show'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Kitchen Tablet Recipe Viewer */}
        <AnimatePresence>
          {selectedContent && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeRecipeViewer}
            >
              <motion.div
                className="bg-gradient-to-br from-white to-orange-50 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-8 border-orange-200 shadow-2xl"
                initial={{ scale: 0.8, opacity: 0, rotateX: -10 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateX: -10 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Kitchen Tablet Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-orange-200">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${station.color} rounded-full flex items-center justify-center text-2xl text-white border-4 border-orange-200`}>
                      {getCookingMethod(selectedContent.content.type).icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-amber-900">{selectedContent.content.title}</h2>
                      <p className="text-orange-600">Recipe by Chef {selectedContent.content.author}</p>
                      <Badge variant="outline" className="mt-1 text-orange-700 border-orange-300">
                        {getCookingMethod(selectedContent.content.type).method} • {selectedContent.content.type}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" onClick={closeRecipeViewer} className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    ✕ Close
                  </Button>
                </div>

                {/* Recipe Progress Tracker */}
                <div className="bg-orange-100 rounded-xl p-4 mb-6 border-2 border-orange-200">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl">⏲️</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-orange-700 mb-1">
                        <span>Preparation Progress</span>
                        <span>Ready to cook • {selectedContent.content.readTime || selectedContent.content.duration}</span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-3">
                        <motion.div
                          className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                    📖 Recipe Instructions
                  </h3>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-orange-200">
                    <p className="text-amber-800 text-lg leading-relaxed mb-4">{selectedContent.content.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-700 mb-2">🧑‍🍳 Chef Notes:</h4>
                        <p className="text-sm text-amber-700">
                          This {getCookingMethod(selectedContent.content.type).method.toLowerCase()} recipe combines the best techniques 
                          in {selectedContent.topic.title.toLowerCase()} to create a perfectly balanced learning experience.
                        </p>
                      </div>
                      <div className="bg-white/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-700 mb-2">🌿 Key Ingredients:</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedContent.content.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-amber-700 border-amber-300 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cooking Action */}
                <div className="text-center">
                  <Button 
                    onClick={() => {
                      closeRecipeViewer();
                      onContentSelect(selectedContent.content, selectedContent.topic, selectedContent.domain);
                    }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg rounded-xl"
                  >
                    <span className="mr-3">👨‍🍳</span>
                    Start Cooking This Recipe
                    <span className="ml-3">🍳</span>
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-8xl mb-6">🔍</div>
          <h3 className="text-3xl font-bold text-amber-900 mb-4">No Recipes Found</h3>
          <p className="text-amber-700 max-w-md mx-auto text-lg">
            Your search didn't match any kitchen stations, chefs, or recipes. Try different ingredients or return to the main kitchen.
          </p>
          <motion.button
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Return to Kitchen
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return null;
}