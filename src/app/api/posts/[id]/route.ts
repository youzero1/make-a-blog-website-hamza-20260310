import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Post);
    const post = await repo.findOneBy({ id });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

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
    const post = await repo.findOneBy({ id });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    post.title = title.trim();
    post.content = content.trim();
    post.author = author.trim();
    post.excerpt = content.trim().slice(0, 150) + (content.trim().length > 150 ? '...' : '');

    const updated = await repo.save(post);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Post);
    const post = await repo.findOneBy({ id });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await repo.remove(post);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
