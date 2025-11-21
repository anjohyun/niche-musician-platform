'use client';

import Card from '@/components/ui/Card';

const emotionalColors: Record<string, string> = {
  melancholic: 'bg-blue-500',
  euphoric: 'bg-yellow-400',
  contemplative: 'bg-purple-500',
  energetic: 'bg-red-500',
  peaceful: 'bg-green-400',
  mysterious: 'bg-indigo-600',
};

interface MusicalDNACardProps {
  stageName?: string;
  artisticMission?: string;
  uniqueValue?: string;
  emotionalTags?: string[];
  situationalTags?: string[];
  sensoryTags?: string[];
  influences?: string[];
  collaborationStyle?: string;
  lookingForCollab?: boolean;
}

export default function MusicalDNACard({
  stageName,
  artisticMission,
  uniqueValue,
  emotionalTags = [],
  situationalTags = [],
  sensoryTags = [],
  influences = [],
  collaborationStyle,
  lookingForCollab,
}: MusicalDNACardProps) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-serif font-bold text-sage-800 dark:text-cream-100">
          {stageName || 'Stage Name'}
        </h3>
        {artisticMission && (
          <p className="mt-2 text-sage-600 dark:text-sage-300">
            {artisticMission}
          </p>
        )}
      </div>

      {uniqueValue && (
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-sage-600 mb-2">내 음악을 들어야 하는 이유</h4>
          <p className="text-sage-700 dark:text-sage-200">{uniqueValue}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <h5 className="text-sm font-semibold text-sage-600 mb-2">감정 팔레트</h5>
          <div className="flex flex-wrap gap-2">
            {emotionalTags.map((t) => (
              <span key={t} className={`px-2 py-1 text-xs rounded-full text-white ${emotionalColors[t] ?? 'bg-forest-600'}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-sage-600 mb-2">상황</h5>
          <div className="flex flex-wrap gap-2">
            {situationalTags.map((t) => (
              <span key={t} className="px-2 py-1 text-xs rounded-full bg-sage-200 text-sage-900">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-sage-600 mb-2">감각</h5>
          <div className="flex flex-wrap gap-2">
            {sensoryTags.map((t) => (
              <span key={t} className="px-2 py-1 text-xs rounded-full bg-cream-200 text-sage-900">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {influences.length > 0 && (
        <div className="mt-5">
          <h5 className="text-sm font-semibold text-sage-600 mb-2">영향 받은 아티스트</h5>
          <div className="flex flex-wrap gap-2">
            {influences.map((t) => (
              <span key={t} className="px-2 py-1 text-xs rounded-full bg-mystic-100 text-mystic-600">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {(collaborationStyle || lookingForCollab) && (
        <div className="mt-5 flex items-center gap-2 text-sage-700 dark:text-sage-300">
          {lookingForCollab ? '협업 오픈 🤝' : null}
          {collaborationStyle ? `• ${collaborationStyle}` : null}
        </div>
      )}
    </Card>
  );
}



