import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const updatedCategory = await Category.findByIdAndUpdate(
        id, 
        { name: body.name, slug }, 
        { new: true }
    );
    return NextResponse.json(updatedCategory);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Category removed' });
}