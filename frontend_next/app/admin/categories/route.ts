import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export async function GET() {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json(categories);
}

export async function POST(request: Request) {
    await connectDB();
    const body = await request.json();

    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const category = await Category.create({ name: body.name, slug });
    return NextResponse.json(category, { status: 201 });
}