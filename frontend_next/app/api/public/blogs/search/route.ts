import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import '@/models/Category';

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q') || '';

        const blogs = await Blog.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        })
        .populate('category', 'name')
        .sort({ publishDate: -1 });

        return NextResponse.json(blogs);
    } catch (error) {
        console.error("Search Error:", error);
        return NextResponse.json({ message: 'Search failed' }, { status: 500 });
    }
}