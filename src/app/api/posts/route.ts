// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
// import { useSession } from 'next-auth/react';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 10;
    
    // Get total count for determining if there are more posts
    const totalPosts = await prisma.post.count();
    
    const data = await prisma.post.findMany({
      include: {
        author: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const postsWithHasLiked = data.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.author?.id || '',
        username: post.author?.username,
        avatar: post.author?.avatar || null
      },
      createdAt: post.createdAt.toISOString(),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      hasLiked: post.likes.includes(post.author),
      media: post.media
    }));

    return NextResponse.json({
      posts: postsWithHasLiked,
      hasMore: totalPosts > page * pageSize
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}