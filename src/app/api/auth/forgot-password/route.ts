import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { allowed } = rateLimit(`forgot-password:${ip}`, { limit: 3, windowSecs: 900 });
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

    // Always return 200 to avoid leaking whether an email exists
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: { id: true, passwordHash: true },
    });

    // Only send reset email for credential accounts (has passwordHash)
    if (user?.passwordHash) {
      const identifier = `reset:${email}`;
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Remove any existing reset tokens for this email
      await db.delete(verificationTokens).where(
        eq(verificationTokens.identifier, identifier)
      );

      await db.insert(verificationTokens).values({
        identifier,
        token,
        expires,
      });

      sendPasswordResetEmail(email, token).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
