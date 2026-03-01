import { NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenant';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq, isNotNull } from 'drizzle-orm';
import { PLAN_LIMITS } from '@/lib/constants';
import type { PlanType } from '@/lib/constants';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'items';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Plan enforcement: check item image limit
    if (type === 'items') {
      const limits = PLAN_LIMITS[tenant.plan as PlanType] || PLAN_LIMITS.free;
      if (limits.maxItemImages !== Infinity) {
        const imageCount = await db
          .select()
          .from(items)
          .where(eq(items.tenantId, tenant.id))
          .then((rows) => rows.filter((r) => r.imageUrl).length);

        if (imageCount >= limits.maxItemImages) {
          return NextResponse.json(
            { error: `Your ${tenant.plan} plan allows up to ${limits.maxItemImages} item images. Upgrade for more.` },
            { status: 403 }
          );
        }
      }
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Accepted: JPEG, PNG, WebP, HEIC' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const id = crypto.randomUUID();

    // Process with Sharp
    const processed = await sharp(buffer)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const thumbnail = await sharp(buffer)
      .resize(400, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Save locally (replace with S3 in production)
    const tenantDir = path.join(UPLOAD_DIR, tenant.id, type);
    await mkdir(tenantDir, { recursive: true });

    const filename = `${id}.webp`;
    const thumbFilename = `${id}_thumb.webp`;

    await writeFile(path.join(tenantDir, filename), processed);
    await writeFile(path.join(tenantDir, thumbFilename), thumbnail);

    const imageUrl = `/uploads/${tenant.id}/${type}/${filename}`;
    const thumbnailUrl = `/uploads/${tenant.id}/${type}/${thumbFilename}`;

    return NextResponse.json({ imageUrl, thumbnailUrl }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'NO_TENANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
