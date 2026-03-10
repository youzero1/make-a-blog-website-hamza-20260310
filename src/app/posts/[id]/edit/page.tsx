'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PostForm from '@/components/PostForm';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
}

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Post not found');
          throw new Error('Failed to fetch post');
        }
        const data = await res.json();
        setPost(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.id]);

  const handleSubmit = async (data: { title: string; content: string; author: string }) => {
    const res = await fetch(`/api/posts/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update post');
    }

    router.push(`/posts/${params.id}`);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-royal-700 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-lg">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">{error || 'Post not found'}</h2>
        <Link href="/" className="btn-primary inline-flex items-center gap-2 mt-4">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="mb-8">
        <Link
          href={`/posts/${params.id}`}
          className="text-royal-700 hover:text-royal-900 font-medium flex items-center gap-1 w-fit"
        >
          ← Back to Post
        </Link>
      </nav>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-serif text-royal-900 mb-2">Edit Post</h1>
        <p className="text-gray-600">Update your royal content below.</p>
      </div>
      <PostForm
        initialData={{ title: post.title, content: post.content, author: post.author }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
