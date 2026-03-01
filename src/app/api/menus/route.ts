import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { menus } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { requireTenant } from '@/lib/tenant';

export async function GET() {
  try {
    const tenant = await requireTenant();

    const result = await db.query.menus.findMany({
      where: eq(menus.tenantId, tenant.id),
      orderBy: [asc(menus.sortOrder)],
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'NO_TENANT') {
      return NextResponse.json({ error: 'No restaurant found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant();
    const { name } = await request.json();

    const [menu] = await db
      .insert(menus)
      .values({
        tenantId: tenant.id,
        name: name || 'New Menu',
      })
      .returning();

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'NO_TENANT') {
      return NextResponse.json({ error: 'No restaurant found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
