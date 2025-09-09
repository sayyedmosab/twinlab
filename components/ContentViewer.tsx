import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ContentPiece, Topic, Domain, Comment } from '../types';
import { CommentSection } from './CommentSection';

interface ContentViewerProps {
  content: ContentPiece;
  topic: Topic;
  domain: Domain;
  onBack: () => void;
  currentUser: any;
  onLoginRequired: () => void;
}

export function ContentViewer({ content, topic, domain, onBack, currentUser, onLoginRequired }: ContentViewerProps) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);

  const getContentIcon = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return <span className="text-lg">📄</span>;
      case 'podcast': return <span className="text-lg">🎧</span>;
      case 'video': return <span className="text-lg">📺</span>;
      case 'guide': return <span className="text-lg">📖</span>;
    }
  };

  const getContentTypeColor = (type: ContentPiece['type']) => {
    switch (type) {
      case 'wiki': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'podcast': return 'bg-green-100 text-green-700 border-green-200';
      case 'video': return 'bg-red-100 text-red-700 border-red-200';
      case 'guide': return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const handleInteraction = (action: string) => {
    if (!currentUser) {
      onLoginRequired();
      return;
    }
    
    if (action === 'like') {
      setLiked(!liked);
    }
  };

  const renderContentBody = () => {
    const paragraphs = content.content.split('\n').filter(p => p.trim());
    
    return (
      <div className="prose prose-gray max-w-none">
        {content.type === 'video' && (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <span className="text-6xl mb-2">📺</span>
              <p className="text-muted-foreground">Video Player Placeholder</p>
              <p className="text-sm text-muted-foreground">Duration: {content.duration}</p>
            </div>
          </div>
        )}
        
        {content.type === 'podcast' && (
          <div className="bg-muted rounded-lg p-6 flex items-center justify-center mb-6">
            <div className="text-center">
              <span className="text-6xl mb-2">🎧</span>
              <p className="text-muted-foreground">Audio Player Placeholder</p>
              <p className="text-sm text-muted-foreground">Duration: {content.duration}</p>
            </div>
          </div>
        )}

        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed">
            {paragraph}
          </p>
        ))}

        {content.type === 'guide' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-blue-900 mb-2">Study Guide Features</h4>
            <ul className="text-blue-800 space-y-1">
              <li>• Interactive exercises and examples</li>
              <li>• Self-assessment questions</li>
              <li>• Additional resources and references</li>
              <li>• Progress tracking capabilities</li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Back Navigation */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 gap-2"
      >
        <span>←</span>
        Back to {topic.title}
      </Button>

      {/* Content Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${getContentTypeColor(content.type)}`}>
              {getContentIcon(content.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <CardTitle className="text-2xl mb-2">{content.title}</CardTitle>
                  <p className="text-muted-foreground text-lg">{content.description}</p>
                </div>
                <Badge variant="secondary" className="capitalize shrink-0">
                  {content.type}
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>👤</span>
                  {content.author}
                </div>
                <div className="flex items-center gap-1">
                  <span>🕒</span>
                  {content.readTime || content.duration}
                </div>
                <span>{content.publishedAt}</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {content.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${domain.color} text-white`}>
          {domain.icon} {domain.title}
        </span>
        <span className="mx-2">→</span>
        <span className="bg-muted px-2 py-1 rounded">{topic.title}</span>
      </div>

      {/* Content Body */}
      <Card className="mb-6">
        <CardContent className="p-8">
          {renderContentBody()}
        </CardContent>
      </Card>

      {/* Action Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleInteraction('like')}
                className={`gap-2 ${liked ? 'text-red-600' : ''}`}
              >
                <span>{liked ? '❤️' : '🤍'}</span>
                {liked ? 'Liked' : 'Like'}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <span>📤</span>
                Share
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowComments(!showComments)}
                className="gap-2"
              >
                <span>💬</span>
                Comments
              </Button>
            </div>
            <Button 
              onClick={() => handleInteraction('suggest')}
              size="sm" 
              className="gap-2"
            >
              <span>➕</span>
              Suggest Addition
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <CommentSection 
            contentId={content.id}
            currentUser={currentUser}
            onLoginRequired={onLoginRequired}
          />
        </motion.div>
      )}

      {/* Related Content Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Content in {topic.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topic.content
              .filter(c => c.id !== content.id)
              .slice(0, 4)
              .map((relatedContent) => (
                <div 
                  key={relatedContent.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className={`p-2 rounded ${getContentTypeColor(relatedContent.type)}`}>
                    {getContentIcon(relatedContent.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{relatedContent.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {relatedContent.readTime || relatedContent.duration}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}