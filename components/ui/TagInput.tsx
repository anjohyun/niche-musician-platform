'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  label: string;
  placeholder?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export default function TagInput({
  label,
  placeholder = '입력 후 쉼표나 Enter를 눌러 추가',
  value = [],
  onChange,
  maxTags,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;
    if (value.includes(trimmedTag)) return;
    if (maxTags && value.length >= maxTags) return;

    onChange([...value, trimmedTag]);
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Backspace on empty input removes the last tag
      removeTag(value.length - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Check if comma was typed
    if (newValue.includes(',')) {
      const tags = newValue.split(',').filter(t => t.trim());
      tags.forEach(tag => addTag(tag));
      setInputValue('');
    } else {
      setInputValue(newValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Add remaining input as tag on blur
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-sage-700 dark:text-sage-300">
        {label}
        {maxTags && (
          <span className="ml-2 text-xs text-slate-500">
            ({value.length}/{maxTags})
          </span>
        )}
      </label>

      <div
        className={`
          min-h-[48px] w-full px-3 py-2 rounded-xl border-2
          bg-white dark:bg-sage-800
          transition-all duration-200
          ${isFocused
            ? 'border-forest-500 ring-2 ring-forest-500/20'
            : 'border-sage-200 dark:border-sage-600'
          }
          ${maxTags && value.length >= maxTags ? 'opacity-75' : ''}
        `}
      >
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium animate-fade-in"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Input */}
        {(!maxTags || value.length < maxTags) && (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder={value.length === 0 ? placeholder : ''}
            className="w-full bg-transparent text-sage-900 dark:text-white focus:outline-none placeholder:text-slate-400"
          />
        )}
      </div>

      {/* Helper Text */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>쉼표(,) 또는 Enter로 추가 • Backspace로 삭제</span>
        {maxTags && value.length >= maxTags && (
          <span className="text-amber-600 dark:text-amber-400">
            최대 개수에 도달했습니다
          </span>
        )}
      </div>
    </div>
  );
}
