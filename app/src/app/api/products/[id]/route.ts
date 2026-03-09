import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataStore';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { Product } from '../route';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const products = readData<Product>('products.json');
    const product = products.find(p => p.id === id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const products = readData<Product>('products.json');
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    products[index] = { ...products[index], ...body, id };
    writeData('products.json', products);
    return NextResponse.json(products[index]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const products = readData<Product>('products.json');
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    writeData('products.json', filtered);
    return NextResponse.json({ success: true });
}
