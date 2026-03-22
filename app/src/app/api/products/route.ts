import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { isAdminAuthenticated } from '@/lib/adminAuth';

/** Escape special regex characters to prevent ReDoS / injection */
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search')?.toLowerCase();
        const category = searchParams.get('category')?.toLowerCase();

        await connectToDatabase();
        
        let query: any = {};

        if (search) {
            const safeSearch = escapeRegex(search);
            query.$or = [
                { name: { $regex: safeSearch, $options: 'i' } },
                { category: { $regex: safeSearch, $options: 'i' } }
            ];
        }

        if (category && category !== 'all') {
            const safeCategory = escapeRegex(category);
            query.category = { $regex: new RegExp(`^${safeCategory}$`, 'i') };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        // Map _id to id for frontend compatibility
        const mappedProducts = products.map(p => ({
            ...p.toObject(),
            id: p._id.toString()
        }));

        return NextResponse.json(mappedProducts);
    } catch (error: any) {
        console.error('Failed to fetch products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const authed = await isAdminAuthenticated();
        if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        
        await connectToDatabase();
        
        const newProduct = await Product.create({
            ...body,
            rating: body.rating ?? 5.0,
            reviews: body.reviews ?? 0,
        });

        return NextResponse.json({
            ...newProduct.toObject(),
            id: newProduct._id.toString()
        }, { status: 201 });
        
    } catch (error: any) {
        console.error('Failed to create product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
