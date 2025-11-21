import Link from 'next/link';
import Image from 'next/image';
import { Play, Heart, MessageCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import { formatNumber, formatDuration, formatRelativeTime } from '@/lib/utils';

interface TrackCardProps {
  id: string;
  title: string;
  coverImage?: string;
  audioUrl: string;
  duration?: number;
  artist: {
    id: string;
    stageName: string;
    avatar?: string;
  };
  playCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
}

export default function TrackCard({
  id,
  title,
  coverImage,
  duration,
  artist,
  playCount,
  likeCount,
  commentCount,
  createdAt,
}: TrackCardProps) {
  return (
    <Card hover className="overflow-hidden">
      {/* Cover Image */}
      <Link href={`/tracks/${id}`}>
        <div className="relative aspect-square bg-slate-200 dark:bg-slate-700 group cursor-pointer">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-16 h-16 text-slate-400" />
            </div>
          )}
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-slate-900 ml-1" />
            </div>
          </div>

          {/* Duration Badge */}
          {duration && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {formatDuration(duration)}
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/tracks/${id}`}>
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2 hover:text-primary-600 transition-colors truncate">
            {title}
          </h3>
        </Link>

        {/* Artist */}
        <Link 
          href={`/profile/${artist.id}`}
          className="flex items-center space-x-2 mb-3 group/artist"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
            {artist.avatar ? (
              <Image
                src={artist.avatar}
                alt={artist.stageName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400 group-hover/artist:text-primary-600 transition-colors">
            {artist.stageName}
          </span>
        </Link>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Play className="w-4 h-4" />
              <span>{formatNumber(playCount)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{formatNumber(likeCount)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{formatNumber(commentCount)}</span>
            </div>
          </div>
          <span className="text-xs">{formatRelativeTime(createdAt)}</span>
        </div>
      </div>
    </Card>
  );
}
