'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
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

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/posts/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      router.push('/');
    } catch (err) {
      console.error(err);
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-royal-700 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-lg">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">{error || 'Post not found'}</h2>
        <Link href="/" className="btn-primary inline-flex items-center gap-2 mt-4">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link href="/" className="text-royal-700 hover:text-royal-900 font-medium flex items-center gap-1 w-fit">
          ← Back to All Posts
        </Link>
      </nav>

      <article>
        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-royal-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-royal-700 rounded-full flex items-center justify-center text-white font-bold">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>
            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
            <div className="text-sm">
              <p className="text-gray-500">Published</p>
              <p className="font-medium text-gray-700">{formatDate(post.createdAt)}</p>
            </div>
            {post.createdAt !== post.updatedAt && (
              <>
                <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
                <div className="text-sm">
                  <p className="text-gray-500">Updated</p>
                  <p className="font-medium text-gray-700">{formatDate(post.updatedAt)}</p>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Divider */}
        <div className="border-t-2 border-crown-200 mb-8"></div>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          {post.content.split('\n').map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index} className="text-gray-800 leading-relaxed mb-4 text-lg">
                {paragraph}
              </p>
            ) : (
              <br key={index} />
            )
          )}
        </div>
      </article>

      {/* Actions */}
      <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
        <Link
          href={`/posts/${post.id}/edit`}
          className="btn-primary inline-flex items-center gap-2"
        >
          ✏️ Edit Post
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          className="btn-danger inline-flex items-center gap-2"
        >
          🗑️ Delete Post
        </button>
        <Link href="/" className="btn-secondary inline-flex items-center gap-2">
          ← Back to Home
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Post?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete &quot;<strong>{post.title}</strong>&quot;? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-danger flex-1 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
