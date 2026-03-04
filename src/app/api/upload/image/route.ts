import { NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenant';
import sharp from 'sharp';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PLAN_LIMITS } from '@/lib/constants';
import type { PlanType } from '@/lib/constants';
import { uploadToS3 } from '@/lib/s3';

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

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
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

    // Upload to S3
    const mainKey = `${tenant.id}/${type}/${id}.webp`;
    const thumbKey = `${tenant.id}/${type}/${id}_thumb.webp`;

    const [imageUrl, thumbnailUrl] = await Promise.all([
      uploadToS3(processed, mainKey, 'image/webp'),
      uploadToS3(thumbnail, thumbKey, 'image/webp'),
    ]);

    return NextResponse.json({ imageUrl, thumbnailUrl }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'NO_TENANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
