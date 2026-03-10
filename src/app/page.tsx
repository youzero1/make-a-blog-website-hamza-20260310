'use client';

import { useState, useEffect, useCallback } from 'react';
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = useCallback(async (query: string = '') => {
    try {
      setLoading(true);
      setError(null);
      const url = query ? `/api/posts?search=${encodeURIComponent(query)}` : '/api/posts';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchPosts(query);
  };

  const handleDelete = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-royal-700 rounded-full mb-6 shadow-lg">
          <span className="text-4xl">👑</span>
        </div>
        <h1 className="text-5xl font-bold font-serif text-royal-900 mb-4">
          Welcome to Crown Blogs
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          A royal platform for sharing your finest thoughts, stories, and ideas with the world.
        </p>
        <Link
          href="/posts/create"
          className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3"
        >
          <span>✍️</span> Write a Post
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
      </div>

      {/* Posts Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-royal-700 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-lg">Loading posts...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-xl font-semibold mb-2">{error}</p>
          <button onClick={() => fetchPosts(searchQuery)} className="btn-secondary mt-4">
            Try Again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">{searchQuery ? '🔍' : '📝'}</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            {searchQuery ? 'No posts found' : 'No posts yet'}
          </h2>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? `No posts match "${searchQuery}". Try a different search term.`
              : 'Be the first to share your royal thoughts!'}
          </p>
          {!searchQuery && (
            <Link href="/posts/create" className="btn-primary inline-flex items-center gap-2">
              <span>✍️</span> Create First Post
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {searchQuery ? (
                <span>
                  Found <strong>{posts.length}</strong> post{posts.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                </span>
              ) : (
                <span>
                  <strong>{posts.length}</strong> post{posts.length !== 1 ? 's' : ''} published
                </span>
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
