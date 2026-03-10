'use client';

import PostForm from '@/components/PostForm';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const router = useRouter();

  const handleSubmit = async (data: { title: string; content: string; author: string }) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create post');
    }

    const post = await res.json();
    router.push(`/posts/${post.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-serif text-royal-900 mb-2">Create New Post</h1>
        <p className="text-gray-600">Share your royal thoughts with the world.</p>
      </div>
      <PostForm onSubmit={handleSubmit} submitLabel="Publish Post" />
    </div>
  );
}
