import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import '@/models/Category';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    try {
        await connectDB();
        const blogs = await Blog.find({}).populate('category', 'name').sort({ createdAt: -1 });
        return NextResponse.json(blogs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const session: any = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
            
            if (!fs.existsSync(uploadDir)) {
                await mkdir(uploadDir, { recursive: true });
            }
            
            await writeFile(path.join(uploadDir, fileName), buffer);
            imageUrl = `/uploads/${fileName}`; 
        }

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const blog = await Blog.create({
            title,
            slug,
            description,
            category,
            author: session.user.id,
            imageThumbnail: imageUrl,
            imageFeatured: imageUrl,
            publishDate: new Date(),
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error: any) {
        console.error("Create Blog Error:", error);
        return NextResponse.json({ error: 'Failed to create blog post', details: error.message }, { status: 500 });
    }
}