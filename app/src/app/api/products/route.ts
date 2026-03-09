import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataStore';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export interface Product {
    id: string;
    name: string;
    brand?: string;
    category: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating?: number;
    reviews?: number;
    image?: string;
    badge?: string;
    inStock: boolean;
    stockLevel: 'in-stock' | 'low-stock' | 'out-of-stock';
    features?: string[];
    isNew?: boolean;
    flashSale?: boolean;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();
    const category = searchParams.get('category')?.toLowerCase();

    let products = readData<Product>('products.json');

    if (search) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(search) ||
            (p.brand?.toLowerCase().includes(search)) ||
            p.category.toLowerCase().includes(search)
        );
    }
    if (category && category !== 'all') {
        products = products.filter(p => p.category.toLowerCase() === category);
    }

    return NextResponse.json(products);
}

export async function POST(request: Request) {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const products = readData<Product>('products.json');

    const newProduct: Product = {
        ...body,
        id: String(Date.now()),
        rating: body.rating ?? 0,
        reviews: body.reviews ?? 0,
    };

    products.push(newProduct);
    writeData('products.json', products);

    return NextResponse.json(newProduct, { status: 201 });
}
