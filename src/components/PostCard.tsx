'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      onDelete(post.id);
    } catch (err) {
      console.error(err);
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="card p-6 flex flex-col h-full group">
        {/* Author Avatar & Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-royal-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">{post.author}</span>
          </div>
          <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
        </div>

        {/* Title */}
        <Link href={`/posts/${post.id}`}>
          <h2 className="text-xl font-bold font-serif text-royal-900 mb-3 group-hover:text-royal-700 transition-colors duration-200 line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
          <Link
            href={`/posts/${post.id}`}
            className="flex-1 text-center py-2 px-3 text-sm font-medium text-royal-700 hover:bg-royal-50 rounded-lg transition-colors duration-200"
          >
            Read More
          </Link>
          <Link
            href={`/posts/${post.id}/edit`}
            className="py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Edit post"
          >
            ✏️
          </Link>
          <button
            onClick={() => setShowConfirm(true)}
            className="py-2 px-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Delete post"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Post?</h3>
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete &quot;<strong>{post.title}</strong>&quot;? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-danger flex-1 flex items-center justify-center gap-2 text-sm"
              >
                {deleting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="btn-secondary flex-1 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
