import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await connectToDatabase();
        const product = await Product.findById(id).lean() as any;
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ ...product, id: product._id.toString() });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 404 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    // Only allow known product fields — prevents injection of _id or other fields
    const { name, description, price, category, image, rating, reviews, stockLevel, isNewItem, features } = body;
    const updatePayload = { name, description, price, category, image, rating, reviews, stockLevel, isNewItem, features };
    // Strip undefined fields
    Object.keys(updatePayload).forEach(k => (updatePayload as any)[k] === undefined && delete (updatePayload as any)[k]);

    try {
        await connectToDatabase();
        const product = await Product.findByIdAndUpdate(id, updatePayload, { new: true }).lean() as any;
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ ...product, id: product._id.toString() });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 404 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    try {
        await connectToDatabase();
        const product = await Product.findByIdAndDelete(id);
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 404 });
    }
}
