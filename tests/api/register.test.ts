import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/email', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/hooks', () => ({
  emitHook: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockReturnValue({ allowed: true, remaining: 4, resetAt: Date.now() + 60000 }),
}));

import { POST } from '@/app/api/auth/register/route';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

function makeRequest(body: object, ip = '1.2.3.4') {
  return new Request('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

// Stub the full DB insert/delete chain used by registration
function mockSuccessfulInsert() {
  const insertValues = vi.fn().mockResolvedValue(undefined);
  vi.mocked(db.insert).mockReturnValue({ values: insertValues } as never);

  const deleteWhere = vi.fn().mockResolvedValue(undefined);
  vi.mocked(db.delete).mockReturnValue({ where: deleteWhere } as never);
}

beforeEach(() => {
  vi.mocked(rateLimit).mockReturnValue({ allowed: true, remaining: 4, resetAt: 0 });
  vi.mocked(db.query.users.findFirst).mockReset();
  vi.mocked(db.query.users.findFirst).mockResolvedValue(undefined);
  mockSuccessfulInsert();
});

// ─── Rate limiting ────────────────────────────────────────────────────────────

describe('POST /api/auth/register — rate limiting', () => {
  it('returns 429 when rate limit is exceeded', async () => {
    vi.mocked(rateLimit).mockReturnValue({ allowed: false, remaining: 0, resetAt: 0 });
    const res = await POST(makeRequest({ email: 'a@b.com', password: 'password123' }));
    expect(res.status).toBe(429);
  });

  it('passes the IP to the rate limiter', async () => {
    await POST(makeRequest({ email: 'a@b.com', password: 'password123' }, '9.9.9.9'));
    expect(rateLimit).toHaveBeenCalledWith(
      expect.stringContaining('9.9.9.9'),
      expect.any(Object)
    );
  });
});

// ─── Input validation ─────────────────────────────────────────────────────────

describe('POST /api/auth/register — input validation', () => {
  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ password: 'password123' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when password is missing', async () => {
    const res = await POST(makeRequest({ email: 'a@b.com' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when password is shorter than 8 characters', async () => {
    const res = await POST(makeRequest({ email: 'a@b.com', password: 'short' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/8/);
  });

  it('accepts password of exactly 8 characters', async () => {
    const res = await POST(makeRequest({ email: 'new@example.com', password: '12345678' }));
    expect(res.status).toBe(201);
  });
});

// ─── Duplicate detection ──────────────────────────────────────────────────────

describe('POST /api/auth/register — duplicate detection', () => {
  it('returns 409 when email is already registered', async () => {
    vi.mocked(db.query.users.findFirst).mockResolvedValue({ id: 'existing' } as never);
    const res = await POST(makeRequest({ email: 'taken@example.com', password: 'password123' }));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toMatch(/already exists/i);
  });
});

// ─── Success ──────────────────────────────────────────────────────────────────

describe('POST /api/auth/register — success', () => {
  it('returns 201 on valid registration', async () => {
    const res = await POST(makeRequest({ name: 'Alice', email: 'alice@example.com', password: 'securepass' }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('inserts the user into the DB', async () => {
    await POST(makeRequest({ name: 'Bob', email: 'bob@example.com', password: 'securepass' }));
    expect(db.insert).toHaveBeenCalled();
  });
});
