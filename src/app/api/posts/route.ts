import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';
import { Like } from 'typeorm';

export async function GET(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Post);
    const searchQuery = request.nextUrl.searchParams.get('search');

    let posts: Post[];
    if (searchQuery && searchQuery.trim()) {
      posts = await repo.find({
        where: [
          { title: Like(`%${searchQuery.trim()}%`) },
          { content: Like(`%${searchQuery.trim()}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
    } else {
      posts = await repo.find({ order: { createdAt: 'DESC' } });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, author } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    if (!author || !author.trim()) {
      return NextResponse.json({ error: 'Author is required' }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Post);

    const post = repo.create({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      excerpt: content.trim().slice(0, 150) + (content.trim().length > 150 ? '...' : ''),
    });

    const saved = await repo.save(post);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
