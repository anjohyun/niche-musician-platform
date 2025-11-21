'use client';

import { Sparkles, Palette, Lightbulb, Wrench } from 'lucide-react';

interface MusicalIdentityVisualizerProps {
  emotionalTags?: string[];
  sensoryTags?: string[];
  situationalTags?: string[];
  influences?: string[];
  toolsAndGear?: string[];
}

export default function MusicalIdentityVisualizer({
  emotionalTags = [],
  sensoryTags = [],
  situationalTags = [],
  influences = [],
  toolsAndGear = [],
}: MusicalIdentityVisualizerProps) {
  const categories = [
    {
      icon: Sparkles,
      title: '감정',
      tags: emotionalTags,
      color: 'bg-pink-100 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800',
      textColor: 'text-pink-700 dark:text-pink-300',
    },
    {
      icon: Palette,
      title: '감각',
      tags: sensoryTags,
      color: 'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-700 dark:text-purple-300',
    },
    {
      icon: Lightbulb,
      title: '영감',
      tags: situationalTags,
      color: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      icon: Wrench,
      title: '도구',
      tags: toolsAndGear,
      color: 'bg-indigo-100 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
      textColor: 'text-indigo-700 dark:text-indigo-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category) => {
        if (category.tags.length === 0) return null;

        const Icon = category.icon;

        return (
          <div
            key={category.title}
            className={`p-4 rounded-lg border ${category.color} ${category.textColor}`}
          >
            <div className="flex items-center mb-3">
              <Icon className="w-5 h-5 mr-2" />
              <h3 className="font-semibold">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-sm rounded-full bg-white/70 dark:bg-slate-800/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

