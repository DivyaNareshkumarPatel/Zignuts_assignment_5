import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
    await connectDB();
    const blogs = await Blog.find({}).populate('category', 'name').sort({ createdAt: -1 });
    return NextResponse.json(blogs);
}

export async function POST(request: Request) {
    await connectDB();
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const image = formData.get('imageThumbnail') as File | null;
    
    let imageUrl = '';

    if (image && image.size > 0) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        
        await writeFile(path.join(uploadDir, fileName), buffer);
        imageUrl = `/uploads/${fileName}`;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const blog = await Blog.create({
        title,
        slug,
        description,
        category,
        imageThumbnail: imageUrl,
        imageFeatured: imageUrl,
        publishDate: new Date(),
    });

    return NextResponse.json(blog, { status: 201 });
}