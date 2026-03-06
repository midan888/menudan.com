import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}));

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      tenants: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn(),
  },
}));

import { POST } from '@/app/api/stripe/webhook/route';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

const mockTenant = { id: 'tenant-1', plan: 'free', stripeCustomerId: 'cus_123' };

function makeRequest(body = 'raw-body', signature = 'valid-sig') {
  return new Request('http://localhost/api/stripe/webhook', {
    method: 'POST',
    headers: { 'stripe-signature': signature },
    body,
  });
}

function mockDbUpdate() {
  const updateWhere = vi.fn().mockResolvedValue(undefined);
  const updateSet = vi.fn().mockReturnValue({ where: updateWhere });
  vi.mocked(db.update).mockReturnValue({ set: updateSet } as never);
  return { updateSet, updateWhere };
}

beforeEach(() => {
  vi.mocked(db.query.tenants.findFirst).mockReset();
  vi.mocked(db.query.tenants.findFirst).mockResolvedValue(mockTenant as never);
  mockDbUpdate();
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
  process.env.STRIPE_PRO_PRICE_ID = 'price_pro';
  process.env.STRIPE_BUSINESS_PRICE_ID = 'price_business';
});

// ─── Signature verification ───────────────────────────────────────────────────

describe('POST /api/stripe/webhook — signature verification', () => {
  it('returns 400 when stripe-signature header is missing', async () => {
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: 'body',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/signature/i);
  });

  it('returns 400 when signature verification fails', async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockImplementation(() => {
      throw new Error('Invalid signature');
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid signature/i);
  });
});

// ─── checkout.session.completed ───────────────────────────────────────────────

describe('POST /api/stripe/webhook — checkout.session.completed', () => {
  it('upgrades tenant plan on successful checkout', async () => {
    const { updateSet } = mockDbUpdate();
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: { tenantId: 'tenant-1', plan: 'pro' },
          subscription: 'sub_abc',
        },
      },
    } as never);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(updateSet).toHaveBeenCalledWith(
      expect.objectContaining({ plan: 'pro', stripeSubscriptionId: 'sub_abc' })
    );
  });

  it('does nothing when metadata is missing', async () => {
    const { updateSet } = mockDbUpdate();
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: { metadata: {}, subscription: null } },
    } as never);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(updateSet).not.toHaveBeenCalled();
  });
});

// ─── customer.subscription.updated ───────────────────────────────────────────

describe('POST /api/stripe/webhook — customer.subscription.updated', () => {
  it('upgrades to pro when price matches pro price id', async () => {
    const { updateSet } = mockDbUpdate();
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_pro',
          customer: 'cus_123',
          status: 'active',
          items: { data: [{ price: { id: 'price_pro' } }] },
        },
      },
    } as never);

    await POST(makeRequest());
    expect(updateSet).toHaveBeenCalledWith(
      expect.objectContaining({ plan: 'pro', stripeSubscriptionId: 'sub_pro' })
    );
  });

  it('upgrades to business when price matches business price id', async () => {
    const { updateSet } = mockDbUpdate();
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_biz',
          customer: 'cus_123',
          status: 'active',
          items: { data: [{ price: { id: 'price_business' } }] },
        },
      },
    } as never);

    await POST(makeRequest());
    expect(updateSet).toHaveBeenCalledWith(
      expect.objectContaining({ plan: 'business' })
    );
  });

  it('falls back to free for unknown price id', async () => {
    const { updateSet } = mockDbUpdate();
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_x',
          customer: 'cus_123',
          status: 'active',
          items: { data: [{ price: { id: 'price_unknown' } }] },
        },
      },
    } as never);

    await POST(makeRequest());
    expect(updateSet).toHaveBeenCalledWith(
      expect.objectContaining({ plan: 'free' })
    );
  });

  it('does not update when subscription status is not active', async () => {
    const { updateSet } = mockDbUpdate();
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_x',
          customer: 'cus_123',
          status: 'past_due',
          items: { data: [{ price: { id: 'price_pro' } }] },
        },
      },
    } as never);

    await POST(makeRequest());
    expect(updateSet).not.toHaveBeenCalled();
  });

  it('does nothing when tenant is not found by customer id', async () => {
    const { updateSet } = mockDbUpdate();
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue(undefined);
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_x',
          customer: 'cus_unknown',
          status: 'active',
          items: { data: [{ price: { id: 'price_pro' } }] },
        },
      },
    } as never);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(updateSet).not.toHaveBeenCalled();
  });
});

// ─── customer.subscription.deleted ───────────────────────────────────────────

describe('POST /api/stripe/webhook — customer.subscription.deleted', () => {
  it('downgrades tenant to free plan on subscription deletion', async () => {
    const { updateSet } = mockDbUpdate();
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: 'customer.subscription.deleted',
      data: {
        object: {
          customer: 'cus_123',
          items: { data: [] },
        },
      },
    } as never);

    await POST(makeRequest());
    expect(updateSet).toHaveBeenCalledWith(
      expect.objectContaining({ plan: 'free', stripeSubscriptionId: null })
    );
  });

  it('does nothing when tenant not found', async () => {
    const { updateSet } = mockDbUpdate();
    vi.mocked(db.query.tenants.findFirst).mockResolvedValue(undefined);
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: 'customer.subscription.deleted',
      data: { object: { customer: 'cus_gone', items: { data: [] } } },
    } as never);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(updateSet).not.toHaveBeenCalled();
  });
});

// ─── Unknown events ───────────────────────────────────────────────────────────

describe('POST /api/stripe/webhook — unknown events', () => {
  it('returns 200 and ignores unhandled event types', async () => {
    const { updateSet } = mockDbUpdate();
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: 'invoice.payment_succeeded',
      data: { object: {} },
    } as never);

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
    expect(updateSet).not.toHaveBeenCalled();
  });
});
