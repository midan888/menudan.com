import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { tenants, menus } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { RESERVED_SLUGS } from '@/lib/constants';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, themeId } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length < 1) {
      return NextResponse.json(
        { error: 'Restaurant name is required' },
        { status: 400 }
      );
    }

    // Check if user already has a tenant
    const existingTenant = await db.query.tenants.findFirst({
      where: eq(tenants.ownerId, session.user.id),
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: 'You already have a restaurant' },
        { status: 409 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(name.trim());
    if (slug.length < 3) {
      slug = slug + '-menu';
    }

    if (RESERVED_SLUGS.includes(slug)) {
      slug = slug + '-' + Math.floor(1000 + Math.random() * 9000);
    }

    // Check uniqueness
    const existingSlug = await db.query.tenants.findFirst({
      where: eq(tenants.slug, slug),
    });

    if (existingSlug) {
      slug = slug + '-' + Math.floor(1000 + Math.random() * 9000);
    }

    // Create tenant
    const [tenant] = await db
      .insert(tenants)
      .values({
        ownerId: session.user.id,
        name: name.trim(),
        slug,
        themeId: themeId || 'modern',
      })
      .returning();

    // Create default menu
    await db.insert(menus).values({
      tenantId: tenant.id,
      name: 'Main Menu',
    });

    return NextResponse.json({ tenant }, { status: 201 });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
