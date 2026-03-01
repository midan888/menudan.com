import { auth } from './auth';
import { db } from './db';
import { tenants } from './db/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentTenant() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.ownerId, session.user.id),
  });

  return tenant ?? null;
}

export async function requireTenant() {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error('NO_TENANT');
  }
  return tenant;
}
