import { NextResponse } from 'next/server';
import { readData } from '@/lib/dataStore';
import { Product } from '@/app/api/products/route';
import { Order } from '@/app/api/orders/route';

export async function GET() {
    const products = readData<Product>('products.json');
    const orders = readData<Order>('orders.json');

    const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0);

    const lowStockCount = products.filter(p => p.stockLevel === 'low-stock' || p.stockLevel === 'out-of-stock').length;

    return NextResponse.json({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        lowStockCount,
        recentOrders: orders.slice(-5).reverse(),
    });
}
