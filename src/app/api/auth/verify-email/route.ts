import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function redirect(path: string) {
  return NextResponse.redirect(`${APP_URL}${path}`);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return redirect('/login?error=invalid-link');
  }

  const record = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.identifier, email),
      eq(verificationTokens.token, token)
    ),
  });

  if (!record) {
    return redirect('/login?error=invalid-link');
  }

  if (record.expires < new Date()) {
    await db.delete(verificationTokens).where(
      and(
        eq(verificationTokens.identifier, email),
        eq(verificationTokens.token, token)
      )
    );
    return redirect('/login?error=link-expired');
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

  return redirect('/login?verified=1');
}
