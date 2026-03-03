import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const { token, email, password } = await request.json();

    if (!token || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const identifier = `reset:${email}`;

    const record = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.identifier, identifier),
        eq(verificationTokens.token, token)
      ),
    });

    if (!record) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    if (record.expires < new Date()) {
      await db.delete(verificationTokens).where(
        eq(verificationTokens.identifier, identifier)
      );
      return NextResponse.json({ error: 'Reset link has expired' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.update(users)
      .set({ passwordHash })
      .where(eq(users.email, email));

    await db.delete(verificationTokens).where(
      eq(verificationTokens.identifier, identifier)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
