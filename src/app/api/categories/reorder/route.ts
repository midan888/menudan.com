import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireTenant } from '@/lib/tenant';

export async function PATCH(request: Request) {
  try {
    const tenant = await requireTenant();
    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'items array is required' }, { status: 400 });
    }

    // Batch update sortOrder
    await Promise.all(
      items.map(({ id, sortOrder }: { id: string; sortOrder: number }) =>
        db
          .update(categories)
          .set({ sortOrder, updatedAt: new Date() })
          .where(and(eq(categories.id, id), eq(categories.tenantId, tenant.id)))
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
