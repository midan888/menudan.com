import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { requireTenant } from '@/lib/tenant';

export async function GET(request: NextRequest) {
  try {
    const tenant = await requireTenant();
    const menuId = request.nextUrl.searchParams.get('menuId');

    if (!menuId) {
      return NextResponse.json({ error: 'menuId is required' }, { status: 400 });
    }

    const result = await db.query.categories.findMany({
      where: and(
        eq(categories.tenantId, tenant.id),
        eq(categories.menuId, menuId)
      ),
      orderBy: [asc(categories.sortOrder)],
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
    const { menuId, name } = await request.json();

    if (!menuId || !name) {
      return NextResponse.json(
        { error: 'menuId and name are required' },
        { status: 400 }
      );
    }

    // Get current max sortOrder
    const existing = await db.query.categories.findMany({
      where: and(
        eq(categories.tenantId, tenant.id),
        eq(categories.menuId, menuId)
      ),
    });
    const maxSort = existing.reduce((max, c) => Math.max(max, c.sortOrder), -1);

    const [category] = await db
      .insert(categories)
      .values({
        menuId,
        tenantId: tenant.id,
        name,
        sortOrder: maxSort + 1,
      })
      .returning();

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'NO_TENANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
