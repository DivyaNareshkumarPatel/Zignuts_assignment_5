import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
    const blog = await Blog.findById(id);
    return NextResponse.json(blog);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Blog removed' });
}