import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return NextResponse.redirect(new URL('/login?error=invalid-link', request.url));
  }

  const record = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.identifier, email),
      eq(verificationTokens.token, token)
    ),
  });

  if (!record) {
    return NextResponse.redirect(new URL('/login?error=invalid-link', request.url));
  }

  if (record.expires < new Date()) {
    await db.delete(verificationTokens).where(
      and(
        eq(verificationTokens.identifier, email),
        eq(verificationTokens.token, token)
      )
    );
    return NextResponse.redirect(new URL('/login?error=link-expired', request.url));
  }

  // Mark email as verified
  await db.update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, email));

  // Delete used token
  await db.delete(verificationTokens).where(
    and(
      eq(verificationTokens.identifier, email),
      eq(verificationTokens.token, token)
    )
  );

  return NextResponse.redirect(new URL('/login?verified=1', request.url));
}
