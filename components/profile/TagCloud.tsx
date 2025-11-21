'use client';

interface TagCloudProps {
  tags: string[];
  maxSize?: number;
  minSize?: number;
}

export default function TagCloud({ tags, maxSize = 24, minSize = 14 }: TagCloudProps) {
  if (tags.length === 0) return null;

  // 태그의 빈도에 따라 크기 결정 (현재는 균등)
  const tagsWithSize = tags.map((tag, index) => ({
    text: tag,
    size: maxSize - ((maxSize - minSize) * index) / tags.length,
  }));

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {tagsWithSize.map((tag, index) => (
        <span
          key={tag.text}
          className="px-3 py-1.5 rounded-full font-medium transition-all hover:scale-110"
          style={{
            fontSize: `${tag.size}px`,
            backgroundColor: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 200}, 0.15)`,
            color: `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100 + 150})`,
          }}
        >
          {tag.text}
        </span>
      ))}
    </div>
  );
}

