import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import fs from 'fs/promises';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

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

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
        }

        // Validate MIME type
        if (!file.type.startsWith('image/')) {
             return NextResponse.json({ error: 'File must be an image.' }, { status: 400 });
        }

        // Validate extension (whitelist)
        const extension = path.extname(file.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return NextResponse.json({ error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a safe, unique filename (strip original name to prevent path traversal)
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
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

        // Prevent path traversal — ensure resolved path is inside uploadsDir
        if (!filepath.startsWith(uploadsDir)) {
            return NextResponse.json({ error: 'Invalid file path.' }, { status: 400 });
        }

        await fs.writeFile(filepath, buffer);

        // Return the public URL
        const imageUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: imageUrl }, { status: 201 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
    }
}

