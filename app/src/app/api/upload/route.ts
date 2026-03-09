import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const authed = await isAdminAuthenticated();
        if (!authed) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
        }

        if (!file.type.startsWith('image/')) {
             return NextResponse.json({ error: 'File must be an image.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = path.extname(file.name) || '.png';
        const filename = `product-${uniqueSuffix}${extension}`;

        // Ensure the absolute path to public/uploads
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        
        // Ensure directory exists
        try {
            await fs.access(uploadsDir);
        } catch {
            await fs.mkdir(uploadsDir, { recursive: true });
        }

        const filepath = path.join(uploadsDir, filename);

        await fs.writeFile(filepath, buffer);

        // Return the public URL
        const imageUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: imageUrl }, { status: 201 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
    }
}
