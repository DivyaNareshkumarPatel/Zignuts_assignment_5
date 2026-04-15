import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
    const blog = await Blog.findById(id);
    return NextResponse.json(blog);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const formData = await request.formData();
        
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const image = formData.get('imageThumbnail') as File | null;
        
        let updateData: any = { 
            title, 
            description, 
            category,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        };

        if (image && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            
            if (!fs.existsSync(uploadDir)) {
                await mkdir(uploadDir, { recursive: true });
            }
            
            await writeFile(path.join(uploadDir, fileName), buffer);
            updateData.imageThumbnail = `/uploads/${fileName}`;
            updateData.imageFeatured = `/uploads/${fileName}`;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(updatedBlog);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Blog removed' });
}