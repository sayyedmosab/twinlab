import React, { useState } from 'react';
import { Header } from './components/Header';
import { KnowledgeMapSpaceship } from './components/KnowledgeMapSpaceship';
import { CosmicLandingPage } from './components/CosmicLandingPage';
import { ContentViewer } from './components/ContentViewer';
import { AuthModal } from './components/AuthModal';

import { mockDomains } from './data/mockData';
import { ContentPiece, Topic, Domain, User } from './types';

type AppView = 'landing' | 'universe' | 'content';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedContent, setSelectedContent] = useState<{
    content: ContentPiece;
    topic: Topic;
    domain: Domain;
  } | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('universe');
  };

  const handleContentSelect = (content: ContentPiece, topic: Topic, domain: Domain) => {
    setSelectedContent({ content, topic, domain });
    setCurrentView('content');
  };

  const handleBackToMap = () => {
    setSelectedContent(null);
    setCurrentView('universe');
  };

  const handleEnterUniverse = () => {
    setCurrentView('universe');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setSelectedContent(null);
  };



  const handleLoginRequired = () => {
    setIsAuthModalOpen(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return (
          <CosmicLandingPage
            onLoginClick={() => setIsAuthModalOpen(true)}
          />
        );
      case 'universe':
        return (
          <div className="min-h-screen bg-background">
            <Header 
              currentUser={currentUser}
              onLoginClick={() => setIsAuthModalOpen(true)}
              onBackToLanding={handleBackToLanding}
              showBackButton={true}
            />
            <KnowledgeMapSpaceship
              domains={mockDomains}
              onContentSelect={handleContentSelect}
              searchQuery=""
            />
          </div>
        );
      case 'content':
        if (!selectedContent) {
          // Safety check: redirect to universe if no content selected
          setCurrentView('universe');
          return null;
        }
        return (
          <div className="min-h-screen bg-background">
            <Header 
              currentUser={currentUser}
              onLoginClick={() => setIsAuthModalOpen(true)}
              onBackToLanding={handleBackToLanding}
              showBackButton={true}
            />
            <main className="container mx-auto">
              <ContentViewer
                content={selectedContent.content}
                topic={selectedContent.topic}
                domain={selectedContent.domain}
                onBack={handleBackToMap}
                currentUser={currentUser}
                onLoginRequired={handleLoginRequired}
              />
            </main>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderContent()}
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
}