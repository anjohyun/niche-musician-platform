export interface User {
  id: string;
  email: string;
  name: string | null;
  password: string | null;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicianProfile {
  id: string;
  userId: string;
  stageName: string;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  location: string | null;
  website: string | null;
  genres: string[];
  niches: string[];
  instruments: string[];
  viewCount: number;
  followerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Track {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  audioUrl: string;
  coverImage: string | null;
  duration: number | null;
  genre: string | null;
  mood: string | null;
  bpm: number | null;
  key: string | null;
  tags: string[];
  playCount: number;
  likeCount: number;
  commentCount: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  trackId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  trackId: string;
  createdAt: Date;
}

