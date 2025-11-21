import Link from 'next/link';
import Image from 'next/image';
import { Music, Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import { formatNumber } from '@/lib/utils';

interface MusicianCardProps {
  id: string;
  stageName: string;
  avatar?: string;
  bio?: string;
  genres: string[];
  niches: string[];
  followerCount: number;
}

export default function MusicianCard({
  id,
  stageName,
  avatar,
  bio,
  genres,
  niches,
  followerCount,
}: MusicianCardProps) {
  return (
    <Link href={`/profile/${id}`}>
      <Card hover className="p-6 cursor-pointer">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
            {avatar ? (
              <Image
                src={avatar}
                alt={stageName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-8 h-8 text-slate-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1 truncate">
              {stageName}
            </h3>
            
            {bio && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                {bio}
              </p>
            )}

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded"
                  >
                    {genre}
                  </span>
                ))}
                {genres.length > 2 && (
                  <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded">
                    +{genres.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Niches */}
            {niches.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {niches.slice(0, 2).map((niche) => (
                  <span
                    key={niche}
                    className="px-2 py-1 text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-full"
                  >
                    {niche}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Users className="w-4 h-4 mr-1" />
              <span>{formatNumber(followerCount)} 팔로워</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
