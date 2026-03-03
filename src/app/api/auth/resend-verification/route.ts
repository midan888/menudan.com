import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';
import { sendVerificationEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { allowed } = rateLimit(`resend-verification:${ip}`, { limit: 3, windowSecs: 900 });
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: { id: true, name: true, emailVerified: true },
    });

    // Only send if user exists and is not yet verified
    if (user && !user.emailVerified) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await db.delete(verificationTokens).where(
        and(eq(verificationTokens.identifier, email))
      );

      await db.insert(verificationTokens).values({
        identifier: email,
        token,
        expires,
      });

      sendVerificationEmail(email, token, user.name ?? undefined).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
