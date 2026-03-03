import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, tenants, menus, categories, items } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/admin';
import { eq, ilike, or, sql, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 20;
  const offset = (page - 1) * limit;

  const searchCondition = search
    ? or(
        ilike(menus.name, `%${search}%`),
        ilike(tenants.name, `%${search}%`),
        ilike(tenants.slug, `%${search}%`),
        ilike(users.email, `%${search}%`)
      )
    : undefined;

  const [data, countResult] = await Promise.all([
    db
      .select({
        id: menus.id,
        name: menus.name,
        isActive: menus.isActive,
        createdAt: menus.createdAt,
        tenantId: tenants.id,
        restaurantName: tenants.name,
        slug: tenants.slug,
        ownerEmail: users.email,
        categoryCount: sql<number>`(select count(*) from categories where categories.menu_id = ${menus.id})`,
        itemCount: sql<number>`(select count(*) from items where items.tenant_id = ${menus.tenantId} and items.category_id in (select id from categories where categories.menu_id = ${menus.id}))`,
      })
      .from(menus)
      .leftJoin(tenants, eq(tenants.id, menus.tenantId))
      .leftJoin(users, eq(users.id, tenants.ownerId))
      .where(searchCondition)
      .orderBy(desc(menus.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(menus)
      .leftJoin(tenants, eq(tenants.id, menus.tenantId))
      .leftJoin(users, eq(users.id, tenants.ownerId))
      .where(searchCondition),
  ]);

  return NextResponse.json({
    menus: data,
    total: Number(countResult[0].count),
    page,
    totalPages: Math.ceil(Number(countResult[0].count) / limit),
  });
}
