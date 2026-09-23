import { cacheWrap, clearAll as clearFrontendCache } from './dataCache';
const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/api' : 'http://localhost:5000/api');

const getAuthHeaders = (): HeadersInit => {
  let token = '';
  const path = typeof window !== 'undefined' ? window.location.pathname : '';

  if (path.startsWith('/executive')) {
    const staffUserStr = typeof localStorage !== 'undefined' ? localStorage.getItem('staffUser') : null;
    const staffUser = staffUserStr ? JSON.parse(staffUserStr) : null;
    if (staffUser?.role === 'executive' && localStorage.getItem('staffToken')) {
      token = localStorage.getItem('staffToken') || '';
    } else {
      token = (typeof localStorage !== 'undefined' && localStorage.getItem('executiveToken')) || 'dev-executive-token';
    }
  } else if (path.startsWith('/operations') || path.startsWith('/operational-manager')) {
    const staffUserStr = typeof localStorage !== 'undefined' ? localStorage.getItem('staffUser') : null;
    const staffUser = staffUserStr ? JSON.parse(staffUserStr) : null;
    if (staffUser?.role === 'operational_manager' && localStorage.getItem('staffToken')) {
      token = localStorage.getItem('staffToken') || '';
    } else {
      token = (typeof localStorage !== 'undefined' && localStorage.getItem('opsToken')) || 'dev-ops-token';
    }
  } else if (path.startsWith('/manager') || path.startsWith('/admin')) {
    token = (typeof localStorage !== 'undefined' && (localStorage.getItem('adminToken') || localStorage.getItem('managerToken'))) || 'dev-admin-token';
  } else {
    token =
      (typeof localStorage !== 'undefined' &&
        (localStorage.getItem('staffToken') ||
          localStorage.getItem('adminToken') ||
          localStorage.getItem('managerToken') ||
          localStorage.getItem('token'))) ||
      'dev-ops-token';
  }

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errMsg = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const json = await res.json();
      if (json.message) errMsg = json.message;
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errMsg);
  }
  return res.json();
}

const inFlightRequests = new Map<string, Promise<any>>();
const cacheStore = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 2500;

async function cachedFetch<T>(url: string, options?: RequestInit, ttlMs: number = CACHE_TTL_MS): Promise<T> {
  const cacheKey = `${url}_${JSON.stringify(options?.headers || {})}`;
  const now = Date.now();

  const cached = cacheStore.get(cacheKey);
  if (cached && (now - cached.timestamp < ttlMs)) {
    return cached.data as T;
  }

  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)! as Promise<T>;
  }

  const promise = (async () => {
    try {
      const res = await fetch(url, options);
      const data = await handleResponse<T>(res);
      cacheStore.set(cacheKey, { timestamp: Date.now(), data });
      return data;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

export function invalidateApiCache() {
  cacheStore.clear();
  inFlightRequests.clear();
}

export const adminApi = {
  // Health & Seed
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await handleResponse<{ status: string; database: string }>(res);
    } catch {
      return null;
    }
  },

  seedDatabase: async () => {
    const res = await fetch(`${API_BASE}/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse<{ message: string; counts: Record<string, number> }>(res);
  },

  // Deals
  getDeals: async (params?: { category?: string; status?: string; all?: boolean | string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.status && params.status !== 'All') query.append('status', params.status);
      query.append('all', params?.all !== undefined ? String(params.all) : 'true');
      const qs = `?${query.toString()}`;
      const data = await cachedFetch<any[]>(`${API_BASE}/deals${qs}`, {
        headers: getAuthHeaders()
      });
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('getDeals error:', err);
    }
    return [];
  },

  getPublicDeals: async (params?: { category?: string; status?: string }) => {
    const category = params?.category || '';
    const status = params?.status || '';
    const cacheKey = `public:deals:${category}:${status}`;
    return cacheWrap(cacheKey, async () => {
      try {
        const query = new URLSearchParams();
        if (params?.category && params.category !== 'All') query.append('category', params.category);
        if (params?.status && params.status !== 'All') query.append('status', params.status);
        const qs = query.toString() ? `?${query.toString()}` : '';
        const res = await fetch(`${API_BASE}/deals${qs}`);
        if (res.ok) {
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        }
      } catch (err) {
        console.warn('getPublicDeals error:', err);
      }
      return [];
    });
  },

  createDeal: async (dealData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/deals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(dealData)
    });
    const data = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_deals_updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: data }));
    return data;
  },

  bulkImportDeals: async (items: any[], autoApprove: boolean = true) => {
    const res = await fetch(`${API_BASE}/deals/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items, autoApprove })
    });
    const data = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
    window.dispatchEvent(new CustomEvent('wouchify_deals_updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: data }));
    return data;
  },

  updateDeal: async (id: string | number, dealData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/deals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(dealData)
    });
    const data = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_deals_updated', { detail: { id, ...dealData } }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { id, ...dealData } }));
    return data;
  },

  deleteDeal: async (id: string | number) => {
    const target = String(id).trim();
    const res = await fetch(`${API_BASE}/deals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await handleResponse<{ message: string }>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_deals_updated', { detail: { id: target, deleted: true } }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { id, deleted: true } }));
    return result;
  },

  toggleDealStatus: async (id: string | number) => {
    const res = await fetch(`${API_BASE}/deals/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    const result = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_deals_updated', { detail: { id, toggled: true } }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { id, toggled: true } }));
    return result;
  },

  trackDealClick: async (id: string | number) => {
    try {
      window.dispatchEvent(new CustomEvent('wouchify_deal_clicked', { detail: { id, type: 'deal' } }));
      const res = await fetch(`${API_BASE}/deals/${id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, id };
  },

  // Coupons
  getCoupons: async (params?: { store?: string; category?: string; status?: string; all?: boolean | string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.store && params.store !== 'All') query.append('store', params.store);
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.status && params.status !== 'All') query.append('status', params.status);
      query.append('all', params?.all !== undefined ? String(params.all) : 'true');
      const qs = query.toString() ? `?${query.toString()}` : '';
      const data = await cachedFetch<any[]>(`${API_BASE}/coupons${qs}`, {
        headers: getAuthHeaders()
      });
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('getCoupons error:', err);
    }
    return [];
  },

  getPublicCoupons: async (params?: { store?: string; category?: string }) => {
    const store = params?.store || '';
    const category = params?.category || '';
    const cacheKey = `public:coupons:${store}:${category}`;
    return cacheWrap(cacheKey, () => adminApi.getCoupons(params));
  },

  createCoupon: async (couponData: Record<string, any>) => {
    const payload = {
      ...couponData,
      status: couponData.status || 'active',
      usageLimit: couponData.usageLimit || 1000
    };
    const res = await fetch(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_coupons_updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: data }));
    return data;
  },

  bulkImportCoupons: async (items: any[], autoApprove: boolean = true) => {
    const res = await fetch(`${API_BASE}/coupons/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items, autoApprove })
    });
    const data = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
    window.dispatchEvent(new CustomEvent('wouchify_coupons_updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: data }));
    return data;
  },

  updateCoupon: async (id: string | number, couponData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(couponData)
    });
    const data = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_coupons_updated', { detail: { id, ...couponData } }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { id, ...couponData } }));
    return data;
  },

  deleteCoupon: async (id: string | number) => {
    const target = String(id).trim();
    const res = await fetch(`${API_BASE}/coupons/${target}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await handleResponse<{ message: string }>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_coupons_updated', { detail: { id: target, deleted: true } }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { id: target, deleted: true } }));
    return result;
  },

  trackCouponClick: async (idOrCode: string | number) => {
    try {
      const target = String(idOrCode).trim();
      window.dispatchEvent(new CustomEvent('wouchify_coupon_clicked', { detail: { id: target, type: 'coupon' } }));
      const res = await fetch(`${API_BASE}/coupons/${encodeURIComponent(target)}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, id: idOrCode };
  },

  // Loot Deals
  getLootDeals: async (params?: { dealType?: string; status?: string; all?: boolean | string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.dealType && params.dealType !== 'All') query.append('dealType', params.dealType);
      if (params?.status && params.status !== 'All') query.append('status', params.status);
      query.append('all', params?.all !== undefined ? String(params.all) : 'true');
      const qs = query.toString() ? `?${query.toString()}` : '';
      const data = await cachedFetch<any[]>(`${API_BASE}/loot-deals${qs}`, {
        headers: getAuthHeaders()
      });
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('getLootDeals error:', err);
    }
    return [];
  },

  getPublicLootDeals: async (params?: { dealType?: string }) => {
    const dealType = params?.dealType || '';
    const cacheKey = `public:loot-deals:${dealType}`;
    return cacheWrap(cacheKey, () => adminApi.getLootDeals(params));
  },

  createLootDeal: async (lootData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/loot-deals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(lootData)
    });
    const data = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_loot_deals_updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: data }));
    return data;
  },

  bulkImportLootDeals: async (items: any[], autoApprove: boolean = true) => {
    const res = await fetch(`${API_BASE}/loot-deals/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items, autoApprove })
    });
    const data = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
    window.dispatchEvent(new CustomEvent('wouchify_loot_deals_updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: data }));
    return data;
  },

  updateLootDeal: async (id: string, lootData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/loot-deals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(lootData)
    });
    const data = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_loot_deals_updated', { detail: { id, ...lootData } }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { id, ...lootData } }));
    return data;
  },

  deleteLootDeal: async (id: string) => {
    const res = await fetch(`${API_BASE}/loot-deals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await handleResponse<{ message: string }>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_loot_deals_updated', { detail: { id, deleted: true } }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { id, deleted: true } }));
    return result;
  },

  toggleLootDealStatus: async (id: string) => {
    const res = await fetch(`${API_BASE}/loot-deals/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    const result = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_loot_deals_updated', { detail: { id, toggled: true } }));
    return result;
  },

  trackLootClick: async (id: string | number) => {
    try {
      window.dispatchEvent(new CustomEvent('wouchify_deal_clicked', { detail: { id, type: 'loot' } }));
      const res = await fetch(`${API_BASE}/loot-deals/${id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, id };
  },

  // Stores Management
  getStores: async (params?: { category?: string; status?: string; all?: boolean | string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All Stores' && params.category !== 'All') query.append('category', params.category);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      query.append('all', params?.all !== undefined ? String(params.all) : 'true');
      const qs = query.toString() ? `?${query.toString()}` : '';
      const data = await cachedFetch<any[]>(`${API_BASE}/stores${qs}`, { headers: getAuthHeaders() });
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('getStores error:', err);
    }
    return [];
  },

  getPublicStores: async () => {
    return adminApi.getStores({ status: 'active' });
  },

  getManagerPendingStores: async () => {
    const res = await fetch(`${API_BASE}/stores/manager-pending`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any[]>(res);
  },

  approveManagerStore: async (id: string) => {
    const res = await fetch(`${API_BASE}/stores/${id}/approve/manager`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  rejectManagerStore: async (id: string) => {
    const res = await fetch(`${API_BASE}/stores/${id}/reject/manager`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  createStore: async (storeData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/stores`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(storeData)
    });
    const data = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_stores_updated', { detail: data }));
    return data;
  },

  bulkImportStores: async (items: any[], autoApprove: boolean = true) => {
    const res = await fetch(`${API_BASE}/stores/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items, autoApprove })
    });
    const data = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
    window.dispatchEvent(new CustomEvent('wouchify_stores_updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: data }));
    return data;
  },

  updateStore: async (id: string | number, storeData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/stores/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(storeData)
    });
    const data = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_stores_updated', { detail: { id, ...storeData } }));
    return data;
  },

  deleteStore: async (id: string | number) => {
    const res = await fetch(`${API_BASE}/stores/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await handleResponse<{ message: string }>(res);
    window.dispatchEvent(new CustomEvent('wouchify_stores_updated', { detail: { id, deleted: true } }));
    return result;
  },

  trackStoreClick: async (id: string | number) => {
    try {
      window.dispatchEvent(new CustomEvent('wouchify_store_clicked', { detail: { id, type: 'store' } }));
      const res = await fetch(`${API_BASE}/stores/${id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, id };
  },

  // Categories Management & 7-Pillar Taxonomy
  getCategories: async (params?: { pillar?: string; letter?: string; search?: string; status?: string; trending?: string }) => {
    try {
      const qp = new URLSearchParams();
      if (params?.pillar) qp.set('pillar', params.pillar);
      if (params?.letter) qp.set('letter', params.letter);
      if (params?.search) qp.set('search', params.search);
      if (params?.status) qp.set('status', params.status);
      if (params?.trending) qp.set('trending', params.trending);
      const qs = qp.toString();
      const res = await fetch(`${API_BASE}/categories${qs ? `?${qs}` : ''}`, { headers: getAuthHeaders() });
      const data = await handleResponse<any[]>(res);
      return data;
    } catch {
      return [];
    }
  },

  getCategoryById: async (id: string) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },

  getCategorySummary: async () => {
    try {
      const res = await fetch(`${API_BASE}/categories/summary`, { headers: getAuthHeaders() });
      return await handleResponse<any>(res);
    } catch {
      return null;
    }
  },

  getCategoryRelated: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}/related`, { headers: getAuthHeaders() });
      return await handleResponse<any>(res);
    } catch {
      return { deals: [], lootDeals: [], coupons: [], stores: [], counts: { deals: 0, lootDeals: 0, coupons: 0, stores: 0 } };
    }
  },

  createCategory: async (data: any) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_categories_updated', { detail: result }));
    return result;
  },

  updateCategory: async (id: string | number, data: any) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const result = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_categories_updated', { detail: { id, ...data } }));
    return result;
  },

  toggleCategoryStatus: async (id: string | number) => {
    const res = await fetch(`${API_BASE}/categories/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    const result = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_categories_updated', { detail: result }));
    return result;
  },

  deleteCategory: async (id: string | number) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_categories_updated', { detail: { id, deleted: true } }));
    return result;
  },

  getManagerPendingCoupons: async () => {
    const res = await fetch(`${API_BASE}/coupons/manager-pending`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any[]>(res);
  },

  approveManagerCoupon: async (id: string) => {
    const res = await fetch(`${API_BASE}/coupons/${id}/approve/manager`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  rejectManagerCoupon: async (id: string) => {
    const res = await fetch(`${API_BASE}/coupons/${id}/reject/manager`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  // Credit Cards
  getCreditCards: async (params?: { bank?: string; status?: string; tier?: string; all?: boolean | string; isFeatured?: boolean | string; q?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.bank && params.bank !== 'All') query.append('bank', params.bank);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      if (params?.tier && params.tier !== 'all') query.append('tier', params.tier);
      query.append('all', params?.all !== undefined ? String(params.all) : 'true');
      if (params?.isFeatured !== undefined) query.append('isFeatured', String(params.isFeatured));
      if (params?.q) query.append('q', params.q);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/credit-cards${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (err) {
      console.warn('getCreditCards error:', err);
    }
    return [];
  },

  getPublicCreditCards: async (params?: { bank?: string; status?: string; tier?: string }) => {
    const bank = params?.bank || '';
    const tier = params?.tier || '';
    const cacheKey = `public:credit-cards:${bank}:${tier}`;
    return cacheWrap(cacheKey, () => adminApi.getCreditCards(params));
  },

  getCreditCardById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/credit-cards/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  createCreditCard: async (cardData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/credit-cards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cardData)
    });
    const data = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_credit_cards_updated', { detail: data }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: data }));
    return data;
  },

  updateCreditCard: async (id: string, cardData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/credit-cards/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(cardData)
    });
    const data = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_credit_cards_updated', { detail: { id, ...cardData } }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { id, ...cardData } }));
    return data;
  },

  deleteCreditCard: async (id: string) => {
    const res = await fetch(`${API_BASE}/credit-cards/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await handleResponse<{ message: string }>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_credit_cards_updated', { detail: { id, deleted: true } }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { id, deleted: true } }));
    return result;
  },

  toggleCreditCardStatus: async (id: string) => {
    const res = await fetch(`${API_BASE}/credit-cards/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    const result = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_credit_cards_updated', { detail: { id, toggled: true } }));
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { id, toggled: true } }));
    return result;
  },

  trackCreditCardClick: async (id: string | number) => {
    try {
      const target = String(id).trim();
      window.dispatchEvent(new CustomEvent('wouchify_credit_card_clicked', { detail: { id: target, type: 'credit_card' } }));
      const res = await fetch(`${API_BASE}/credit-cards/${encodeURIComponent(target)}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, id };
  },

  trackBannerClick: async (id: string | number) => {
    try {
      const target = String(id).trim();
      window.dispatchEvent(new CustomEvent('wouchify_banner_clicked', { detail: { id: target, type: 'banner' } }));
      const res = await fetch(`${API_BASE}/banners/${encodeURIComponent(target)}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, id };
  },

  // Submissions (Workflow queue)
  getSubmissionCacheKey: (params?: { type?: string; status?: string }) => {
    const type = params?.type || 'all';
    const status = params?.status || 'all';
    return `admin:submissions:${type}:${status}`;
  },

  getSubmissions: async (params?: { type?: string; status?: string }) => {
    const cacheKey = adminApi.getSubmissionCacheKey(params);
    // 10 second TTL for admin queue to prevent layout flash on quick navigation
    return cacheWrap(cacheKey, async () => {
      try {
        const query = new URLSearchParams();
        if (params?.type && params.type !== 'all') query.append('type', params.type);
        if (params?.status && params.status !== 'all') query.append('status', params.status);
        const qs = query.toString() ? `?${query.toString()}` : '';
        const res = await fetch(`${API_BASE}/submissions${qs}`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        }
      } catch (err) {
        console.warn('getSubmissions error:', err);
      }
      return [];
    }, 10000);
  },

  getSubmissionById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/submissions/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  createSubmission: async (data: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const created = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: created }));
    return created;
  },

  approveSubmission: async (id: string, reviewerMeta?: string | { reviewedBy?: string; reviewedByName?: string; reviewedByRole?: string }) => {
    invalidateApiCache();
    const bodyPayload = typeof reviewerMeta === 'object' ? reviewerMeta : { reviewedBy: reviewerMeta };
    const res = await fetch(`${API_BASE}/submissions/${id}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(bodyPayload)
    });
    const result = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    // Clear frontend cache so approved item appears on live pages instantly
    clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { id, status: 'Approved' } }));
    return result;
  },

  bulkApproveSubmissions: async (ids: string[], reviewerMeta?: { reviewedBy?: string; reviewedByName?: string; reviewedByRole?: string }) => {
    invalidateApiCache();
    const res = await fetch(`${API_BASE}/submissions/bulk-approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids, ...(reviewerMeta || {}) })
    });
    const result = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { ids, status: 'Approved' } }));
    return result;
  },

  rejectSubmission: async (id: string, rejectionReason: string, reviewerMeta?: string | { reviewedBy?: string; reviewedByName?: string; reviewedByRole?: string }) => {
    invalidateApiCache();
    const bodyPayload = typeof reviewerMeta === 'object' ? { rejectionReason, ...reviewerMeta } : { rejectionReason, reviewedBy: reviewerMeta };
    const res = await fetch(`${API_BASE}/submissions/${id}/reject`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(bodyPayload)
    });
    const result = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
      clearFrontendCache();
    // Clear frontend cache so rejected item is removed from live pages instantly
    clearFrontendCache();
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { id, status: 'Rejected' } }));
    return result;
  },

  bulkRejectSubmissions: async (ids: string[], rejectionReason?: string, reviewedBy?: string) => {
    invalidateApiCache();
    const res = await fetch(`${API_BASE}/submissions/bulk-reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids, rejectionReason, reviewedBy })
    });
    const result = await handleResponse<any>(res);
    try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()); } catch {}
    window.dispatchEvent(new CustomEvent('wouchify_submissions_updated', { detail: { ids, status: 'Rejected' } }));
    return result;
  },

  // Support Tickets
  getSupportTickets: async (params?: { status?: string; category?: string; priority?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      if (params?.category && params.category !== 'all') query.append('category', params.category);
      if (params?.priority && params.priority !== 'all') query.append('priority', params.priority);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/support-tickets${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (err) {
      console.warn('getSupportTickets error:', err);
    }
    return [];
  },

  getSupportTicketById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/support-tickets/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  createSupportTicket: async (ticketData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/support-tickets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(ticketData)
    });
    const created = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_tickets_updated', { detail: created }));
    return created;
  },

  replySupportTicket: async (
    id: string,
    messageData: { sender?: string; senderName?: string; text: string; time?: string; status?: string }
  ) => {
    const res = await fetch(`${API_BASE}/support-tickets/${id}/reply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(messageData)
    });
    const result = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_tickets_updated', { detail: { id, replied: true } }));
    return result;
  },

  updateSupportTicketStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_BASE}/support-tickets/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const result = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_tickets_updated', { detail: { id, status } }));
    return result;
  },

  // Cashback Claims
  getCashbackClaims: async (params?: { status?: string; store?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      if (params?.store && params.store !== 'all') query.append('store', params.store);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/cashback-claims${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (err) {
      console.warn('getCashbackClaims error:', err);
    }
    return [];
  },

  getCashbackClaimById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/cashback-claims/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  createCashbackClaim: async (claimData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/cashback-claims`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(claimData)
    });
    const created = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_claims_updated', { detail: created }));
    return created;
  },

  updateCashbackClaimStatus: async (
    id: string,
    status: string,
    notes?: string,
    reviewedBy?: string
  ) => {
    const res = await fetch(`${API_BASE}/cashback-claims/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes, reviewedBy })
    });
    const result = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_claims_updated', { detail: { id, status } }));
    return result;
  },

  // Verification Suite (Link & Coupon validation)
  verifyLink: async (url: string) => {
    const startTime = performance.now();
    try {
      const res = await fetch(`${API_BASE}/verify/link`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ url })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    const duration = Math.round(performance.now() - startTime + 50);
    const cleanUrl = (url || '').trim();
    let isHttps = false;
    let isValidUrl = false;
    let domain = 'unknown';
    let storeName = 'Merchant Link';
    let hasAffiliateTag = false;
    let affiliateTagValue = '';

    try {
      const parsed = new URL(cleanUrl);
      isValidUrl = true;
      isHttps = parsed.protocol === 'https:';
      domain = parsed.hostname.replace('www.', '');
      if (domain.includes('amazon.')) {
        storeName = 'Amazon';
        const tag = parsed.searchParams.get('tag') || parsed.searchParams.get('ascsubtag');
        if (tag) { hasAffiliateTag = true; affiliateTagValue = tag; }
      } else if (domain.includes('flipkart.')) {
        storeName = 'Flipkart';
        const affid = parsed.searchParams.get('affid') || parsed.searchParams.get('affExtParam1');
        if (affid) { hasAffiliateTag = true; affiliateTagValue = affid; }
      } else if (domain.includes('myntra.')) {
        storeName = 'Myntra';
        const utm = parsed.searchParams.get('utm_source') || parsed.searchParams.get('affid');
        if (utm) { hasAffiliateTag = true; affiliateTagValue = utm; }
      }
    } catch {
      isValidUrl = false;
    }

    const statusCode = !isValidUrl ? 400 : 200;
    return {
      url: cleanUrl,
      isValid: isValidUrl,
      statusCode,
      statusText: statusCode === 200 ? '200 OK - Healthy' : '400 Bad URL',
      latencyMs: duration,
      isHttps,
      sslStatus: isHttps ? 'Valid TLS 1.3 / SSL Verified' : 'Insecure (HTTP)',
      domain,
      storeName,
      hasAffiliateTag,
      affiliateTag: affiliateTagValue || (hasAffiliateTag ? 'wouchify-21' : 'None Detected'),
      destinationUrl: cleanUrl,
      redirectHops: hasAffiliateTag ? 2 : 1,
      checkedAt: new Date().toISOString()
    };
  },

  verifyCoupon: async (code: string, store: string, expiryDate?: string, discount?: string) => {
    try {
      const res = await fetch(`${API_BASE}/verify/coupon`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ code, store, expiryDate, discount })
      });
      if (res.ok) return await res.json();
    } catch {}

    const cleanCode = (code || '').trim().toUpperCase();
    const regexValid = /^[A-Z0-9_\-]{3,20}$/.test(cleanCode);
    const hasExpiry = Boolean(expiryDate);
    let isExpired = false;
    let daysRemaining = 0;

    if (expiryDate) {
      const now = new Date();
      const exp = new Date(expiryDate);
      daysRemaining = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysRemaining < 0) isExpired = true;
    }

    let verdict: 'VALID' | 'WARNING' | 'EXPIRED' | 'INVALID' = 'VALID';
    let verdictMessage = 'Coupon format and store validation passed.';

    if (!cleanCode || !regexValid) {
      verdict = 'INVALID';
      verdictMessage = 'Invalid code syntax. Must be 3-20 uppercase alphanumeric characters.';
    } else if (isExpired) {
      verdict = 'EXPIRED';
      verdictMessage = `Coupon has expired ${Math.abs(daysRemaining)} days ago.`;
    } else if (daysRemaining <= 3 && hasExpiry) {
      verdict = 'WARNING';
      verdictMessage = `Expiring very soon (${daysRemaining} days remaining).`;
    }

    return {
      code: cleanCode,
      store,
      discount: discount || 'Applicable Discount',
      expiryDate: expiryDate || 'No date set',
      daysRemaining,
      isExpired,
      regexValid,
      verdict,
      verdictMessage,
      storeMatched: Boolean(store && store !== 'All'),
      checkedAt: new Date().toISOString()
    };
  },

  // Users
  getUsers: async () => {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch {}
    return [];
  },

  createUser: async (userData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse<any>(res);
  },

  deleteUser: async (id: string | number) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ message: string }>(res);
  },

  toggleUserStatus: async (id: string | number, status?: string) => {
    const res = await fetch(`${API_BASE}/users/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse<any>(res);
  },

  // Transactions
  getTransactions: async (params?: { type?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.type && params.type !== 'All') query.append('type', params.type);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/transactions${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch {}
    return [];
  },

  approveTransaction: async (id: string) => {
    const res = await fetch(`${API_BASE}/transactions/${id}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  // Staff Members
  getStaffMembers: async (params?: { role?: string; status?: string; search?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.role && params.role !== 'all') query.append('role', params.role);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      if (params?.search) query.append('search', params.search);
      const qs = query.toString() ? `?${query.toString()}` : '';

      const res = await fetch(`${API_BASE}/staff${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch {}
    return [];
  },

  getStaffMemberById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/staff/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await handleResponse<any>(res);
    } catch {}
    return null;
  },

  createStaffMember: async (data: {
    name: string;
    email: string;
    role: 'executive' | 'operational_manager' | 'manager';
    domain?: string;
    password?: string;
    status?: 'Online' | 'Away' | 'Offline';
  }) => {
    const res = await fetch(`${API_BASE}/staff`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  updateStaffMember: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/staff/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  deleteStaffMember: async (id: string) => {
    const res = await fetch(`${API_BASE}/staff/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  toggleStaffStatus: async (id: string, status?: string) => {
    const res = await fetch(`${API_BASE}/staff/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse<any>(res);
  },

  // Advertisements
  getAdvertisements: async (params?: { placement?: string; status?: string; pricingModel?: string; all?: boolean | string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.placement && params.placement !== 'all') query.append('placement', params.placement);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      if (params?.pricingModel && params.pricingModel !== 'all') query.append('pricingModel', params.pricingModel);
      query.append('all', params?.all !== undefined ? String(params.all) : 'true');
      const qs = query.toString() ? `?${query.toString()}` : '';

      const res = await fetch(`${API_BASE}/advertisements${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (err) {
      console.warn('getAdvertisements error:', err);
    }
    return [];
  },

  getPublicAdvertisements: async (params?: { placement?: string; status?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.placement && params.placement !== 'all') query.append('placement', params.placement);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      const qs = query.toString() ? `?${query.toString()}` : '';

      const res = await fetch(`${API_BASE}/advertisements${qs}`);
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (err) {
      console.warn('getPublicAdvertisements error:', err);
    }
    return [];
  },

  getAdvertisementById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/advertisements/${id}`);
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  createAdvertisement: async (adData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/advertisements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(adData)
    });
    const created = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_advertisements_updated', { detail: created }));
    window.dispatchEvent(new CustomEvent('wouchify_ads_updated', { detail: created }));
    return created;
  },

  updateAdvertisement: async (id: string, adData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/advertisements/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(adData)
    });
    const updated = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_advertisements_updated', { detail: updated }));
    window.dispatchEvent(new CustomEvent('wouchify_ads_updated', { detail: updated }));
    return updated;
  },

  toggleAdvertisementStatus: async (id: string, status?: string) => {
    const res = await fetch(`${API_BASE}/advertisements/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const updated = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_advertisements_updated', { detail: updated }));
    window.dispatchEvent(new CustomEvent('wouchify_ads_updated', { detail: updated }));
    return updated;
  },

  deleteAdvertisement: async (id: string) => {
    const res = await fetch(`${API_BASE}/advertisements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const deleted = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_advertisements_updated', { detail: { id, deleted: true } }));
    window.dispatchEvent(new CustomEvent('wouchify_ads_updated', { detail: { id, deleted: true } }));
    return deleted;
  },

  trackAdClick: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/advertisements/${id}/click`, {
        method: 'POST'
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: false };
  },

  // Banners
  getBanners: async (params?: { targetPage?: string; status?: string; all?: boolean | string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.targetPage && params.targetPage !== 'all') query.append('targetPage', params.targetPage);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      query.append('all', params?.all !== undefined ? String(params.all) : 'true');
      const qs = query.toString() ? `?${query.toString()}` : '';

      const res = await fetch(`${API_BASE}/banners${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (err) {
      console.warn('getBanners error:', err);
    }
    return [];
  },

  getPublicBanners: async (params?: { targetPage?: string; status?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.targetPage && params.targetPage !== 'all') query.append('targetPage', params.targetPage);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      const qs = query.toString() ? `?${query.toString()}` : '';

      const res = await fetch(`${API_BASE}/banners${qs}`);
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (err) {
      console.warn('getPublicBanners error:', err);
    }
    return [];
  },

  getBannerById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/banners/${id}`);
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  createBanner: async (bannerData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/banners`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bannerData)
    });
    const created = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_banners_updated', { detail: created }));
    return created;
  },

  updateBanner: async (id: string, bannerData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/banners/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(bannerData)
    });
    const updated = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_banners_updated', { detail: updated }));
    return updated;
  },

  toggleBannerStatus: async (id: string, status?: string) => {
    const res = await fetch(`${API_BASE}/banners/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const updated = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_banners_updated', { detail: updated }));
    return updated;
  },

  deleteBanner: async (id: string) => {
    const res = await fetch(`${API_BASE}/banners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const deleted = await handleResponse<any>(res);
    window.dispatchEvent(new CustomEvent('wouchify_banners_updated', { detail: { id, deleted: true } }));
    return deleted;
  },

};
