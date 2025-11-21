'use client';

import { useState } from 'react';
import { uploadTrack } from '@/lib/actions/tracks';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Upload, Music, X } from 'lucide-react';

interface UploadFormProps {
  userId: string;
  onSuccess?: () => void;
}

export default function UploadForm({ userId, onSuccess }: UploadFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audioUrl: '',
    coverImage: '',
    genre: '',
    mood: '',
    tags: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.title || !formData.audioUrl) {
      setErrors({ submit: '제목과 오디오 URL은 필수입니다' });
      return;
    }

    setIsLoading(true);

    try {
      const result = await uploadTrack({
        userId,
        title: formData.title,
        description: formData.description || undefined,
        audioUrl: formData.audioUrl,
        coverImage: formData.coverImage || undefined,
        genre: formData.genre || undefined,
        mood: formData.mood || undefined,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : undefined,
        isPublished: true,
      });

      if (result.error) {
        setErrors({ submit: result.error });
      } else {
        // Reset form
        setFormData({
          title: '',
          description: '',
          audioUrl: '',
          coverImage: '',
          genre: '',
          mood: '',
          tags: '',
        });
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ submit: '업로드 중 오류가 발생했습니다' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <Upload className="w-5 h-5 mr-2" />
        음악 업로드
      </Button>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          음악 업로드
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="제목"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="음악 제목"
          error={errors.title}
          required
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            설명
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="음악에 대한 설명을 작성해주세요"
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Audio URL */}
        <Input
          label="오디오 URL"
          name="audioUrl"
          type="url"
          value={formData.audioUrl}
          onChange={handleChange}
          placeholder="https://..."
          error={errors.audioUrl}
          required
        />

        {/* Cover Image URL */}
        <Input
          label="커버 이미지 URL (선택사항)"
          name="coverImage"
          type="url"
          value={formData.coverImage}
          onChange={handleChange}
          placeholder="https://..."
          error={errors.coverImage}
        />

        {/* Genre */}
        <Input
          label="장르"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="Electronic, Ambient..."
          error={errors.genre}
        />

        {/* Mood */}
        <Input
          label="무드"
          name="mood"
          value={formData.mood}
          onChange={handleChange}
          placeholder="Chill, Energetic..."
          error={errors.mood}
        />

        {/* Tags */}
        <Input
          label="태그 (쉼표로 구분)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="AI, Ambient, Electronic"
          error={errors.tags}
        />

        {/* Error Message */}
        {errors.submit && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.submit}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="flex-1"
          >
            업로드
          </Button>
        </div>
      </form>
    </div>
  );
}

