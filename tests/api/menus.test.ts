import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/tenant', () => ({
  requireTenant: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      menus: {
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { GET, POST } from '@/app/api/menus/route';
import { PATCH, DELETE } from '@/app/api/menus/[id]/route';
import { requireTenant } from '@/lib/tenant';
import { db } from '@/lib/db';

const freeTenant = { id: 'tenant-1', plan: 'free' };
const proTenant = { id: 'tenant-1', plan: 'pro' };
const businessTenant = { id: 'tenant-1', plan: 'business' };
const mockMenu = { id: 'menu-1', tenantId: 'tenant-1', name: 'Lunch' };

function postRequest(body: object) {
  return new Request('http://localhost/api/menus', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

function patchRequest(body: object) {
  return new Request('http://localhost/api/menus/menu-1', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.mocked(requireTenant).mockResolvedValue(freeTenant as never);
  vi.mocked(db.query.menus.findMany).mockReset();
  vi.mocked(db.query.menus.findMany).mockResolvedValue([]);
});

// ─── GET ──────────────────────────────────────────────────────────────────────

describe('GET /api/menus', () => {
  it('returns 404 when tenant not found', async () => {
    vi.mocked(requireTenant).mockRejectedValue(new Error('NO_TENANT'));
    const res = await GET();
    expect(res.status).toBe(404);
  });

  it('returns menus for the tenant', async () => {
    vi.mocked(db.query.menus.findMany).mockResolvedValue([mockMenu] as never);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].id).toBe('menu-1');
  });
});

// ─── POST — plan limit enforcement ───────────────────────────────────────────

describe('POST /api/menus — plan limits', () => {
  it('returns 404 when no tenant', async () => {
    vi.mocked(requireTenant).mockRejectedValue(new Error('NO_TENANT'));
    const res = await POST(postRequest({ name: 'New' }));
    expect(res.status).toBe(404);
  });

  it('blocks free plan at 3 menus', async () => {
    vi.mocked(requireTenant).mockResolvedValue(freeTenant as never);
    vi.mocked(db.query.menus.findMany).mockResolvedValue([{}, {}, {}] as never);
    const res = await POST(postRequest({ name: 'Menu 4' }));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toMatch(/free/i);
  });

  it('allows free plan with 2 existing menus', async () => {
    vi.mocked(requireTenant).mockResolvedValue(freeTenant as never);
    vi.mocked(db.query.menus.findMany).mockResolvedValue([{}, {}] as never);
    const insertReturning = vi.fn().mockResolvedValue([mockMenu]);
    const insertValues = vi.fn().mockReturnValue({ returning: insertReturning });
    vi.mocked(db.insert).mockReturnValue({ values: insertValues } as never);

    const res = await POST(postRequest({ name: 'Menu 3' }));
    expect(res.status).toBe(201);
  });

  it('blocks pro plan at 5 menus', async () => {
    vi.mocked(requireTenant).mockResolvedValue(proTenant as never);
    vi.mocked(db.query.menus.findMany).mockResolvedValue([{}, {}, {}, {}, {}] as never);
    const res = await POST(postRequest({ name: 'Menu 6' }));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toMatch(/pro/i);
  });

  it('allows pro plan with 4 existing menus', async () => {
    vi.mocked(requireTenant).mockResolvedValue(proTenant as never);
    vi.mocked(db.query.menus.findMany).mockResolvedValue([{}, {}, {}, {}] as never);
    const insertReturning = vi.fn().mockResolvedValue([mockMenu]);
    const insertValues = vi.fn().mockReturnValue({ returning: insertReturning });
    vi.mocked(db.insert).mockReturnValue({ values: insertValues } as never);

    const res = await POST(postRequest({ name: 'Menu 5' }));
    expect(res.status).toBe(201);
  });

  it('never blocks business plan regardless of count', async () => {
    vi.mocked(requireTenant).mockResolvedValue(businessTenant as never);
    vi.mocked(db.query.menus.findMany).mockResolvedValue(
      Array(100).fill({}) as never
    );
    const insertReturning = vi.fn().mockResolvedValue([mockMenu]);
    const insertValues = vi.fn().mockReturnValue({ returning: insertReturning });
    vi.mocked(db.insert).mockReturnValue({ values: insertValues } as never);

    const res = await POST(postRequest({ name: 'Menu 101' }));
    expect(res.status).toBe(201);
  });

  it('falls back to free limits for unknown plan', async () => {
    vi.mocked(requireTenant).mockResolvedValue({ id: 'tenant-1', plan: 'unknown' } as never);
    vi.mocked(db.query.menus.findMany).mockResolvedValue([{}, {}, {}] as never);
    const res = await POST(postRequest({ name: 'Menu 4' }));
    expect(res.status).toBe(403);
  });

  it('defaults name to "New Menu" when not provided', async () => {
    vi.mocked(db.query.menus.findMany).mockResolvedValue([]);
    const insertReturning = vi.fn().mockResolvedValue([{ ...mockMenu, name: 'New Menu' }]);
    const insertValues = vi.fn().mockReturnValue({ returning: insertReturning });
    vi.mocked(db.insert).mockReturnValue({ values: insertValues } as never);

    await POST(postRequest({}));
    expect(insertValues).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Menu' })
    );
  });
});

// ─── PATCH ────────────────────────────────────────────────────────────────────

describe('PATCH /api/menus/[id]', () => {
  const routeParams = { params: Promise.resolve({ id: 'menu-1' }) };

  it('returns 401 when no tenant', async () => {
    vi.mocked(requireTenant).mockRejectedValue(new Error('NO_TENANT'));
    const res = await PATCH(patchRequest({ name: 'Updated' }), routeParams);
    expect(res.status).toBe(401);
  });

  it('returns 404 when menu not found or belongs to another tenant', async () => {
    const updateReturning = vi.fn().mockResolvedValue([]);
    const updateWhere = vi.fn().mockReturnValue({ returning: updateReturning });
    const updateSet = vi.fn().mockReturnValue({ where: updateWhere });
    vi.mocked(db.update).mockReturnValue({ set: updateSet } as never);

    const res = await PATCH(patchRequest({ name: 'Updated' }), routeParams);
    expect(res.status).toBe(404);
  });

  it('updates and returns the menu', async () => {
    const updated = { ...mockMenu, name: 'Updated' };
    const updateReturning = vi.fn().mockResolvedValue([updated]);
    const updateWhere = vi.fn().mockReturnValue({ returning: updateReturning });
    const updateSet = vi.fn().mockReturnValue({ where: updateWhere });
    vi.mocked(db.update).mockReturnValue({ set: updateSet } as never);

    const res = await PATCH(patchRequest({ name: 'Updated' }), routeParams);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('Updated');
  });
});

// ─── DELETE ───────────────────────────────────────────────────────────────────

describe('DELETE /api/menus/[id]', () => {
  const routeParams = { params: Promise.resolve({ id: 'menu-1' }) };

  it('returns 401 when no tenant', async () => {
    vi.mocked(requireTenant).mockRejectedValue(new Error('NO_TENANT'));
    const res = await DELETE(new Request('http://localhost'), routeParams);
    expect(res.status).toBe(401);
  });

  it('returns 404 when menu not found', async () => {
    const deleteReturning = vi.fn().mockResolvedValue([]);
    const deleteWhere = vi.fn().mockReturnValue({ returning: deleteReturning });
    vi.mocked(db.delete).mockReturnValue({ where: deleteWhere } as never);

    const res = await DELETE(new Request('http://localhost'), routeParams);
    expect(res.status).toBe(404);
  });

  it('deletes the menu and returns success', async () => {
    const deleteReturning = vi.fn().mockResolvedValue([mockMenu]);
    const deleteWhere = vi.fn().mockReturnValue({ returning: deleteReturning });
    vi.mocked(db.delete).mockReturnValue({ where: deleteWhere } as never);

    const res = await DELETE(new Request('http://localhost'), routeParams);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
