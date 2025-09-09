export interface ContentPiece {
  id: string;
  title: string;
  type: 'wiki' | 'podcast' | 'video' | 'guide';
  description: string;
  content: string;
  duration?: string; // for podcasts/videos
  readTime?: string; // for wiki/guides
  author: string;
  publishedAt: string;
  tags: string[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  content: ContentPiece[];
}

export interface Domain {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  topics: Topic[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'architect' | 'learner';
  avatar?: string;
}

export interface Comment {
  id: string;
  contentId: string;
  userId: string;
  author: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}