import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export function readData<T>(filename: string): T[] {
    const file = path.join(DATA_DIR, filename);
    if (!fs.existsSync(file)) return [];
    try {
        return JSON.parse(fs.readFileSync(file, 'utf-8')) as T[];
    } catch {
        return [];
    }
}

export function writeData<T>(filename: string, data: T[]): void {
    const file = path.join(DATA_DIR, filename);
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}
