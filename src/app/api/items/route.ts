import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { requireTenant } from '@/lib/tenant';

export async function GET(request: NextRequest) {
  try {
    const tenant = await requireTenant();
    const categoryId = request.nextUrl.searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json({ error: 'categoryId is required' }, { status: 400 });
    }

    const result = await db.query.items.findMany({
      where: and(
        eq(items.tenantId, tenant.id),
        eq(items.categoryId, categoryId)
      ),
      orderBy: [asc(items.sortOrder)],
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'NO_TENANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant();
    const body = await request.json();

    if (!body.categoryId || !body.name || body.price === undefined) {
      return NextResponse.json(
        { error: 'categoryId, name, and price are required' },
        { status: 400 }
      );
    }

    // Get current max sortOrder
    const existing = await db.query.items.findMany({
      where: and(
        eq(items.tenantId, tenant.id),
        eq(items.categoryId, body.categoryId)
      ),
    });
    const maxSort = existing.reduce((max, i) => Math.max(max, i.sortOrder), -1);

    const [item] = await db
      .insert(items)
      .values({
        categoryId: body.categoryId,
        tenantId: tenant.id,
        name: body.name,
        description: body.description || null,
        price: String(body.price),
        currency: body.currency || 'USD',
        prices: body.prices || {},
        imageUrl: body.imageUrl || null,
        isAvailable: body.isAvailable ?? true,
        badges: body.badges || [],
        allergens: body.allergens || [],
        sortOrder: maxSort + 1,
      })
      .returning();

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'NO_TENANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Item create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
