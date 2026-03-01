import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireTenant } from '@/lib/tenant';

export async function PATCH(request: Request) {
  try {
    const tenant = await requireTenant();
    const { items: itemsList } = await request.json();

    if (!Array.isArray(itemsList)) {
      return NextResponse.json({ error: 'items array is required' }, { status: 400 });
    }

    await Promise.all(
      itemsList.map(({ id, sortOrder }: { id: string; sortOrder: number }) =>
        db
          .update(items)
          .set({ sortOrder, updatedAt: new Date() })
          .where(and(eq(items.id, id), eq(items.tenantId, tenant.id)))
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'NO_TENANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
