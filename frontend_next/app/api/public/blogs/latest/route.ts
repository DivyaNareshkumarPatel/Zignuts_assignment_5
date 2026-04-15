import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import '@/models/Category';
export async function GET() {
    try {
        await connectDB();

        const blogs = await Blog.find({})
            .populate('category', 'name')
            .sort({ publishDate: -1 })
            .limit(10);
            
        return NextResponse.json(blogs);
    } catch (error) {
        console.error("Latest Blogs Error:", error);
        return NextResponse.json({ error: 'Failed to fetch latest blogs' }, { status: 500 });
    }
}