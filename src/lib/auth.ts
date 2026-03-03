import NextAuth from 'next-auth';
import type { AdapterAccountType } from 'next-auth/adapters';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { eq, and } from 'drizzle-orm';
import { db } from './db';
import { users, accounts, sessions, verificationTokens } from './db/schema';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    newUser: '/onboarding',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        });

        if (existingUser) {
          // Check if this Google account is already linked
          const existingAccount = await db.query.accounts.findFirst({
            where: and(
              eq(accounts.provider, 'google'),
              eq(accounts.userId, existingUser.id)
            ),
          });

          if (!existingAccount) {
            // Link Google account to the existing user
            await db.insert(accounts).values({
              userId: existingUser.id,
              type: account.type as AdapterAccountType,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token ?? null,
              access_token: account.access_token ?? null,
              expires_at: account.expires_at ?? null,
              token_type: account.token_type ?? null,
              scope: account.scope ?? null,
              id_token: account.id_token ?? null,
              session_state: account.session_state as string ?? null,
            });
          }

          // Override the user id so the JWT callback gets the correct one
          user.id = existingUser.id;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        // Fetch role and emailVerified from DB on sign-in
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id!),
          columns: { role: true, emailVerified: true },
        });
        token.role = dbUser?.role ?? 'user';
        token.emailVerified = dbUser?.emailVerified ?? null;
      }
      // Refresh role and emailVerified on session update
      if (trigger === 'update' && token.id) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, token.id as string),
          columns: { role: true, emailVerified: true },
        });
        token.role = dbUser?.role ?? 'user';
        token.emailVerified = dbUser?.emailVerified ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? 'user';
        session.user.emailVerified = (token.emailVerified as Date | null) ?? null;
      }
      return session;
    },
  },
});
