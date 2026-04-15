import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import '@/models/Category';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        await connectDB();
        const { slug } = await params;
        

        const blog = await Blog.findOne({ slug }).populate('category', 'name');
        
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        
        return NextResponse.json(blog);
    } catch (error) {
        console.error("Blog Fetch Error:", error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}