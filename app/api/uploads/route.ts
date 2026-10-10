import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/x-icon': '.ico',
  'image/vnd.microsoft.icon': '.ico',
  'image/svg+xml': '.svg',
};

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Choose a PNG or JPG file.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be 10MB or smaller.' }, { status: 400 });
  }
  const name = file.name.toLowerCase();
  let ext = ALLOWED[file.type];
  if (!ext && name.endsWith('.ico')) ext = '.ico';
  if (!ext && name.endsWith('.svg')) ext = '.svg';
  if (!ext) {
    return NextResponse.json({ error: 'Use PNG, JPG, SVG, or ICO.' }, { status: 400 });
  }

  const folderRaw = String(form.get('folder') || 'categories').toLowerCase();
  const folder = folderRaw === 'profile' ? 'profile' : 'categories';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${folder}/${filename}`, name: file.name, size: file.size });
}
