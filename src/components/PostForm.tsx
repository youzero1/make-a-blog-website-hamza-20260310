'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PostFormData {
  title: string;
  content: string;
  author: string;
}

interface PostFormProps {
  initialData?: PostFormData;
  onSubmit: (data: PostFormData) => Promise<void>;
  submitLabel?: string;
}

export default function PostForm({
  initialData,
  onSubmit,
  submitLabel = 'Submit',
}: PostFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    author: initialData?.author || '',
  });
  const [errors, setErrors] = useState<Partial<PostFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<PostFormData> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';
    else if (formData.title.trim().length > 200) newErrors.title = 'Title must be less than 200 characters';

    if (!formData.content.trim()) newErrors.content = 'Content is required';
    else if (formData.content.trim().length < 10) newErrors.content = 'Content must be at least 10 characters';

    if (!formData.author.trim()) newErrors.author = 'Author name is required';
    else if (formData.author.trim().length < 2) newErrors.author = 'Author name must be at least 2 characters';
    else if (formData.author.trim().length > 100) newErrors.author = 'Author name must be less than 100 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PostFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <span>{submitError}</span>
        </div>
      )}

      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Post Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter an engaging title for your post..."
          className={`input-field ${
            errors.title ? 'border-red-400 focus:ring-red-400' : ''
          }`}
          disabled={submitting}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span> {errors.title}
          </p>
        )}
      </div>

      {/* Author Field */}
      <div>
        <label htmlFor="author" className="block text-sm font-semibold text-gray-700 mb-2">
          Author Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Your name..."
          className={`input-field ${
            errors.author ? 'border-red-400 focus:ring-red-400' : ''
          }`}
          disabled={submitting}
        />
        {errors.author && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span> {errors.author}
          </p>
        )}
      </div>

      {/* Content Field */}
      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your post content here..."
          rows={14}
          className={`input-field resize-y min-h-[200px] ${
            errors.content ? 'border-red-400 focus:ring-red-400' : ''
          }`}
          disabled={submitting}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.content ? (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span>⚠️</span> {errors.content}
            </p>
          ) : (
            <span></span>
          )}
          <span className="text-xs text-gray-400">{formData.content.length} characters</span>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary flex items-center gap-2 min-w-[140px] justify-center"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <span>✍️</span> {submitLabel}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={submitting}
          className="btn-secondary flex items-center gap-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
