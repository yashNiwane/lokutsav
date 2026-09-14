import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

// Route segment config to allow large payloads (video files up to 100MB)
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const rawExt = path.extname(file.name).toLowerCase();
    const allowedExts = [
      // Images
      '.jpg', '.jpeg', '.png', '.webp', '.heic',
      // Videos (max 3 minutes)
      '.mp4', '.mov', '.webm', '.m4v', '.mkv'
    ];

    const ext = allowedExts.includes(rawExt) ? rawExt : '.mp4';
    const isVideo = ['.mp4', '.mov', '.webm', '.m4v', '.mkv'].includes(ext);

    const prefix = isVideo ? 'video' : 'photo';
    const cleanFileName = `lokutsav_${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, cleanFileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${cleanFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: cleanFileName,
      size: file.size,
      isVideo,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
