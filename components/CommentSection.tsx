import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Comment } from '../types';

interface CommentSectionProps {
  contentId: string;
  currentUser: any;
  onLoginRequired: () => void;
}

export function CommentSection({ contentId, currentUser, onLoginRequired }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      contentId,
      userId: 'user1',
      author: 'Dr. Sarah Chen',
      content: 'This is an excellent overview of parametric design principles. The examples really help clarify the concepts. I would love to see more case studies on real-world implementations.',
      createdAt: '2024-03-01',
      replies: [
        {
          id: '2',
          contentId,
          userId: 'user2',
          author: 'Alex Rodriguez',
          content: 'I agree! The Casa Milà example was particularly insightful. Are there any similar projects using contemporary tools?',
          createdAt: '2024-03-02'
        }
      ]
    },
    {
      id: '3',
      contentId,
      userId: 'user3',
      author: 'Prof. Michael Torres',
      content: 'For those interested in diving deeper, I recommend checking out the latest research from MIT on algorithmic design. There are some fascinating developments in this field.',
      createdAt: '2024-03-03'
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddComment = () => {
    if (!currentUser) {
      onLoginRequired();
      return;
    }

    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        contentId,
        userId: currentUser.id,
        author: currentUser.name,
        content: newComment,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleAddReply = (parentId: string) => {
    if (!currentUser) {
      onLoginRequired();
      return;
    }

    if (replyText.trim()) {
      const reply: Comment = {
        id: Date.now().toString(),
        contentId,
        userId: currentUser.id,
        author: currentUser.name,
        content: replyText,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setComments(comments.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...(comment.replies || []), reply] }
          : comment
      ));
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getUserRole = (author: string) => {
    if (author.startsWith('Dr.') || author.startsWith('Prof.')) return 'architect';
    return 'learner';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>💬</span>
          Discussion ({comments.length} {comments.length === 1 ? 'comment' : 'comments'})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment */}
        <div className="space-y-3">
          {currentUser ? (
            <>
              <Textarea
                placeholder="Share your thoughts, ask questions, or suggest improvements..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Contributing as <strong>{currentUser.name}</strong> ({currentUser.role})
                </p>
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Post Comment
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-muted p-4 rounded-lg text-center">
              <span className="text-4xl mb-2">⚠️</span>
              <p className="text-muted-foreground mb-3">Please login to join the discussion</p>
              <Button onClick={onLoginRequired}>Login to Comment</Button>
            </div>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                    {getUserInitials(comment.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{comment.author}</span>
                    <Badge 
                      variant={getUserRole(comment.author) === 'architect' ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      {getUserRole(comment.author)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{comment.createdAt}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      <span>👍</span>
                      Helpful
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs gap-1"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      <span>↩️</span>
                      Reply
                    </Button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                          Reply
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white text-xs">
                          {getUserInitials(reply.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{reply.author}</span>
                          <Badge 
                            variant={getUserRole(reply.author) === 'architect' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {getUserRole(reply.author)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{reply.createdAt}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{reply.content}</p>
                        <Button variant="ghost" size="sm" className="text-xs gap-1">
                          <span>👍</span>
                          Helpful
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <span className="text-6xl opacity-50 mb-3">💬</span>
            <p>No comments yet. Start the discussion!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}