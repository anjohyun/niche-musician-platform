'use client';

import { useState } from 'react';

interface Tag {
  id: string;
  label: string;
  emoji?: string;
}

interface Category {
  name: string;
  tags: Tag[];
}

interface EmotionalPaletteSelectorProps {
  categories: Category[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function EmotionalPaletteSelector({
  categories,
  selectedTags,
  onTagsChange,
}: EmotionalPaletteSelectorProps) {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const handleTagClick = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Selection Counter */}
      <div className="text-center p-4 bg-primary-50 dark:bg-primary-950/30 rounded-xl">
        <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
          {selectedTags.length === 0
            ? '태그를 선택해보세요! 원하는 만큼 선택할 수 있습니다 ✨'
            : `${selectedTags.length}개의 태그 선택됨`
          }
        </p>
      </div>

      {categories.map((category, categoryIndex) => (
        <div
          key={category.name}
          className="animate-fade-in"
          style={{ animationDelay: `${categoryIndex * 100}ms` }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {category.name}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({category.tags.filter(tag => selectedTags.includes(tag.id)).length}/{category.tags.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {category.tags.map((tag, tagIndex) => {
              const isSelected = selectedTags.includes(tag.id);
              const isHovered = hoveredTag === tag.id;

              return (
                <button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.id)}
                  onMouseEnter={() => setHoveredTag(tag.id)}
                  onMouseLeave={() => setHoveredTag(null)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium
                    transition-all duration-200 ease-out
                    transform hover:-translate-y-1
                    ${isSelected
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/50 scale-105 ring-2 ring-primary-300 dark:ring-primary-700'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-400 hover:shadow-md'
                    }
                    ${isHovered && !isSelected ? 'scale-105' : ''}
                  `}
                  style={{
                    animationDelay: `${(categoryIndex * 100) + (tagIndex * 50)}ms`
                  }}
                >
                  {tag.emoji && (
                    <span className={`mr-2 inline-block transition-transform ${isSelected ? 'scale-110' : ''}`}>
                      {tag.emoji}
                    </span>
                  )}
                  {tag.label}
                  {isSelected && (
                    <span className="ml-2 inline-block animate-bounce">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Helpful Tip */}
      {selectedTags.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800 animate-fade-in">
          <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
            <span className="text-lg">💡</span>
            <span>좋아요! 선택한 태그들이 당신의 음악적 정체성을 형성합니다.</span>
          </p>
        </div>
      )}
    </div>
  );
}

