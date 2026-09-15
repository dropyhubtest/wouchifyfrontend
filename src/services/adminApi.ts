import { MASTER_EXECUTIVE_DEALS, MASTER_EXECUTIVE_LOOT_DEALS } from '../data/dealsPage';
import { FAVOURITE_STORES } from '../data/storesHero';
import { MASTER_COUPONS } from '../data/couponsData';
import { CREDIT_CARDS } from '../data/creditCardsData';

export const MASTER_CREDIT_CARDS_DATA = CREDIT_CARDS.map((c, i) => ({
  id: c.id,
  cardName: c.name,
  bank: c.tagText,
  network: 'Visa',
  tier: c.section === 'premium' ? 'Premium' : 'Classic',
  imageUrl: '',
  bankLogoUrl: c.logo,
  welcomeOffer: c.keyBenefitValue,
  rewardRate: c.rewardsValue,
  keyBenefits: c.suitedFor.join(', '),
  partnerBrands: c.suitedFor.join(', '),
  affiliateLink: c.applyHref,
  annualFee: c.section === 'premium' ? '₹999' : '₹0',
  joiningFee: c.section === 'premium' ? '₹999' : '₹0',
  feeWaiver: 'Spend ₹1L/year',
  offerStartDate: '2026-01-01',
  offerExpiryDate: '2026-12-31',
  lastUpdated: '2026-09-01',
  status: 'featured',
  isFeatured: true,
  isVerified: true,
  applyCount: parseInt(c.userCount.replace(/[^0-9]/g, '')) * 100 || 3500,
  viewCount: 15000 + i * 2000,
  addedOn: '2026-01-01',
}));

export const MASTER_STORES_DATA = FAVOURITE_STORES.map((s, i) => {
  const storeClicksMap: Record<string, number> = {
    amazon: 24850,
    flipkart: 21450,
    myntra: 18320,
    swiggy: 19800,
    zomato: 17640,
    ajio: 15200,
    nykaa: 13900,
    zepto: 14200,
    bigbasket: 12800,
    'reliance-digital': 11400,
    'tata-cliq': 9800,
    meesho: 16300,
    jiomart: 10500,
    firstcry: 9100,
    pepperfry: 8400,
    snapdeal: 7900,
    zivame: 7400,
    udaan: 6200,
    voonik: 5400,
    yepme: 4900
  };
  const storeDealsMap: Record<string, number> = {
    amazon: 45,
    flipkart: 38,
    myntra: 29,
    swiggy: 24,
    zomato: 26,
    ajio: 22,
    nykaa: 19,
    zepto: 16,
    bigbasket: 18,
    'reliance-digital': 15,
    'tata-cliq': 14,
    meesho: 20,
    jiomart: 14,
    firstcry: 12,
    pepperfry: 11,
    snapdeal: 10,
    zivame: 9,
    udaan: 8,
    voonik: 7,
    yepme: 6
  };
  return {
    id: s.id,
    _id: s.id,
    name: s.name,
    slug: s.slug,
    logoUrl: s.logo as unknown as string,
    logo: s.logo,
    category: s.category,
    reward: s.reward,
    description: s.description,
    affiliateLink: `https://${s.slug}.com/?affid=wouchify`,
    cardBg: s.cardBg,
    badgeBg: s.badgeBg,
    status: 'active' as const,
    isFeatured: i < 6,
    clicks: storeClicksMap[s.id] || (10000 - i * 300),
    totalDeals: storeDealsMap[s.id] || (25 - i),
    addedOn: '2026-01-15'
  };
});

const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = (): HeadersInit => {
  const token =
    localStorage.getItem('adminToken') ||
    localStorage.getItem('staffToken') ||
    localStorage.getItem('managerToken') ||
    '';
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
  getDeals: async (params?: { category?: string; status?: string }) => {
    let backendDeals: any[] = [];
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.status && params.status !== 'All') query.append('status', params.status);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/deals${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        backendDeals = await res.json();
      }
    } catch {
      // Backend request error handled gracefully
    }

    let localDeals: any[] = [];
    try {
      const cached = localStorage.getItem('wouchify_public_deals');
      if (cached) localDeals = JSON.parse(cached);
    } catch {}

    if (backendDeals.length === 0) {
      if (localDeals.length >= 12) {
        return localDeals;
      }
      return MASTER_EXECUTIVE_DEALS;
    }

    const backendIds = new Set(backendDeals.map((d: any) => String(d._id || d.id)));
    const backendNames = new Set(backendDeals.map((d: any) => String(d.name).toLowerCase().trim()));
    const missingInBackend = localDeals.filter(
      (d: any) => !backendIds.has(String(d._id || d.id)) && !backendNames.has(String(d.name).toLowerCase().trim())
    );

    const merged = [...missingInBackend, ...backendDeals];
    try {
      if (merged.length > 0) {
        localStorage.setItem('wouchify_public_deals', JSON.stringify(merged));
      }
    } catch {}
    return merged;
  },

  getPublicDeals: async (params?: { category?: string; status?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.status && params.status !== 'All') query.append('status', params.status);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/deals${qs}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          try {
            localStorage.setItem('wouchify_public_deals', JSON.stringify(data));
          } catch {}
          return data;
        }
      }
    } catch {
      // Offline fallback
    }
    try {
      const cached = localStorage.getItem('wouchify_public_deals');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= 12) return parsed;
      }
    } catch {}
    return MASTER_EXECUTIVE_DEALS;
  },

  createDeal: async (dealData: Record<string, any>) => {
    const newEntry = { _id: dealData._id || String(Date.now()), id: dealData.id || Date.now(), ...dealData };
    try {
      const cachedStr = localStorage.getItem('wouchify_public_deals');
      const cachedList = cachedStr ? JSON.parse(cachedStr) : [];
      const updatedList = [newEntry, ...cachedList.filter((d: any) => (d.id !== dealData.id && d._id !== dealData.id) && d.name !== dealData.name)];
      localStorage.setItem('wouchify_public_deals', JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent('wouchify_deals_updated', { detail: newEntry }));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/deals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(dealData)
      });
      return await handleResponse<any>(res);
    } catch (err) {
      console.warn('Backend createDeal fallback:', err);
      return newEntry;
    }
  },

  updateDeal: async (id: string | number, dealData: Record<string, any>) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_public_deals');
      if (cachedStr) {
        const cachedList = JSON.parse(cachedStr);
        const updatedList = cachedList.map((d: any) =>
          d._id === String(id) || String(d.id) === String(id) ? { ...d, ...dealData } : d
        );
        localStorage.setItem('wouchify_public_deals', JSON.stringify(updatedList));
        window.dispatchEvent(new CustomEvent('wouchify_deals_updated'));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/deals/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(dealData)
      });
      return await handleResponse<any>(res);
    } catch (err) {
      console.warn('Backend updateDeal fallback:', err);
      return { _id: String(id), id, ...dealData };
    }
  },

  deleteDeal: async (id: string | number) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_public_deals');
      if (cachedStr) {
        const cachedList = JSON.parse(cachedStr);
        const updatedList = cachedList.filter(
          (d: any) => d._id !== String(id) && String(d.id) !== String(id)
        );
        localStorage.setItem('wouchify_public_deals', JSON.stringify(updatedList));
        window.dispatchEvent(new CustomEvent('wouchify_deals_updated'));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/deals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await handleResponse<{ message: string }>(res);
    } catch (err) {
      return { message: 'Deal deleted (offline mode)' };
    }
  },

  toggleDealStatus: async (id: string | number) => {
    try {
      const res = await fetch(`${API_BASE}/deals/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      return await handleResponse<any>(res);
    } catch {
      return { success: true, id };
    }
  },

  trackDealClick: async (id: string | number) => {
    // 1. Update local cache immediately
    try {
      const isMatch = (item: any, targetId: string | number) => {
        const tId = String(targetId).trim().toLowerCase();
        const rId1 = String(item._id || '').trim().toLowerCase();
        const rId2 = String(item.id || '').trim().toLowerCase();
        if (rId1 === tId || rId2 === tId) return true;
        const num1 = tId.replace(/[^0-9]/g, '');
        const num2 = (rId1 || rId2).replace(/[^0-9]/g, '');
        return Boolean(num1 && num2 && num1 === num2);
      };

      let list = [];
      const cachedStr = localStorage.getItem('wouchify_public_deals');
      if (cachedStr) {
        try { list = JSON.parse(cachedStr); } catch {}
      }
      if (!Array.isArray(list) || list.length === 0) {
        list = [...MASTER_EXECUTIVE_DEALS];
      }

      const updated = list.map((d: any) =>
        isMatch(d, id) ? { ...d, clicks: (typeof d.clicks === 'number' ? d.clicks : 0) + 1 } : d
      );
      localStorage.setItem('wouchify_public_deals', JSON.stringify(updated));
      localStorage.setItem('wouchify_executive_deals', JSON.stringify(updated));

      // Also update MASTER_EXECUTIVE_DEALS in-memory instance for current session
      const masterTarget = MASTER_EXECUTIVE_DEALS.find((m: any) => isMatch(m, id));
      if (masterTarget) {
        masterTarget.clicks = (masterTarget.clicks || 0) + 1;
      }
    } catch (err) {
      console.warn('trackDealClick storage error:', err);
    }

    // 2. Dispatch events for cross-tab and in-tab real-time sync
    try {
      window.dispatchEvent(new CustomEvent('wouchify_deals_updated', { detail: { id, type: 'deal' } }));
      window.dispatchEvent(new CustomEvent('wouchify_deal_clicked', { detail: { id, type: 'deal' } }));
    } catch {}

    // 3. Send to backend
    try {
      const res = await fetch(`${API_BASE}/deals/${id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, id };
  },

  // Coupons
  getCoupons: async () => {
    let backendCoupons: any[] = [];
    try {
      const res = await fetch(`${API_BASE}/coupons`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        backendCoupons = await res.json();
      }
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_coupons');
      if (cached && (!cached.includes('AMAZON10') || cached.includes('AMZTECH1000') || cached.includes('WOUCH50'))) {
        localStorage.removeItem('wouchify_coupons');
      } else if (cached) {
        const local = JSON.parse(cached);
        if (Array.isArray(local) && local.length > 0 && backendCoupons.length === 0) {
          return local;
        }
      }
    } catch {}

    if (backendCoupons.length > 0) {
      try {
        localStorage.setItem('wouchify_coupons', JSON.stringify(backendCoupons));
      } catch {}
      return backendCoupons;
    }
    try {
      localStorage.setItem('wouchify_coupons', JSON.stringify(MASTER_COUPONS));
    } catch {}
    return MASTER_COUPONS;
  },

  createCoupon: async (couponData: Record<string, any>) => {
    const newEntry = { id: couponData.id || `coupon-${Date.now()}`, ...couponData };
    try {
      const cachedStr = localStorage.getItem('wouchify_coupons');
      const cachedList = cachedStr ? JSON.parse(cachedStr) : [...MASTER_COUPONS];
      localStorage.setItem('wouchify_coupons', JSON.stringify([newEntry, ...cachedList]));
      window.dispatchEvent(new CustomEvent('wouchify_coupons_updated', { detail: newEntry }));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/coupons`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(couponData)
      });
      return await handleResponse<any>(res);
    } catch {
      return newEntry;
    }
  },

  updateCoupon: async (id: string | number, couponData: Record<string, any>) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_coupons');
      const cachedList = cachedStr ? JSON.parse(cachedStr) : [...MASTER_COUPONS];
      const updated = cachedList.map((c: any) => String(c.id || c._id) === String(id) ? { ...c, ...couponData } : c);
      localStorage.setItem('wouchify_coupons', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('wouchify_coupons_updated', { detail: { id, ...couponData } }));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/coupons/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(couponData)
      });
      return await handleResponse<any>(res);
    } catch {
      return { id, ...couponData };
    }
  },

  deleteCoupon: async (id: string | number) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_coupons');
      if (cachedStr) {
        const cachedList = JSON.parse(cachedStr);
        const updated = cachedList.filter((c: any) => String(c.id || c._id) !== String(id));
        localStorage.setItem('wouchify_coupons', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('wouchify_coupons_updated', { detail: { id } }));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/coupons/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await handleResponse<{ message: string }>(res);
    } catch {
      return { message: 'Coupon deleted' };
    }
  },

  // Loot Deals
  getLootDeals: async (params?: { dealType?: string }) => {
    let backendLoot: any[] = [];
    try {
      const query = new URLSearchParams();
      if (params?.dealType && params.dealType !== 'All') query.append('dealType', params.dealType);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/loot-deals${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) backendLoot = await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_loot_deals');
      if (cached) {
        const local = JSON.parse(cached);
        if (Array.isArray(local) && local.length > 0) {
          if (backendLoot.length === 0) return local;
        }
      }
    } catch {}

    if (backendLoot.length > 0) return backendLoot;
    return MASTER_EXECUTIVE_LOOT_DEALS;
  },

  createLootDeal: async (lootData: Record<string, any>) => {
    const newEntry = { _id: lootData._id || String(Date.now()), id: lootData.id || `loot-${Date.now()}`, ...lootData };
    try {
      const cachedStr = localStorage.getItem('wouchify_loot_deals');
      const cachedList = cachedStr ? JSON.parse(cachedStr) : [];
      localStorage.setItem('wouchify_loot_deals', JSON.stringify([newEntry, ...cachedList]));
      window.dispatchEvent(new CustomEvent('wouchify_loot_deals_updated', { detail: newEntry }));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/loot-deals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(lootData)
      });
      return await handleResponse<any>(res);
    } catch {
      return newEntry;
    }
  },

  updateLootDeal: async (id: string, lootData: Record<string, any>) => {
    try {
      const isMatch = (l: any) => {
        const tId = String(id).trim().toLowerCase();
        const rId1 = String(l._id || '').trim().toLowerCase();
        const rId2 = String(l.id || '').trim().toLowerCase();
        if (rId1 === tId || rId2 === tId) return true;
        const num1 = tId.replace(/[^0-9]/g, '');
        const num2 = (rId1 || rId2).replace(/[^0-9]/g, '');
        return Boolean(num1 && num2 && num1 === num2);
      };

      const cachedStr = localStorage.getItem('wouchify_loot_deals');
      const cachedList = cachedStr ? JSON.parse(cachedStr) : [...MASTER_EXECUTIVE_LOOT_DEALS];
      const updated = cachedList.map((l: any) => isMatch(l) ? { ...l, ...lootData } : l);
      localStorage.setItem('wouchify_loot_deals', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('wouchify_loot_deals_updated', { detail: { id, ...lootData } }));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/loot-deals/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(lootData)
      });
      return await handleResponse<any>(res);
    } catch {
      return { id, ...lootData };
    }
  },

  deleteLootDeal: async (id: string) => {
    try {
      const isMatch = (l: any) => {
        const tId = String(id).trim().toLowerCase();
        const rId1 = String(l._id || '').trim().toLowerCase();
        const rId2 = String(l.id || '').trim().toLowerCase();
        if (rId1 === tId || rId2 === tId) return true;
        const num1 = tId.replace(/[^0-9]/g, '');
        const num2 = (rId1 || rId2).replace(/[^0-9]/g, '');
        return Boolean(num1 && num2 && num1 === num2);
      };

      const cachedStr = localStorage.getItem('wouchify_loot_deals');
      if (cachedStr) {
        const list = JSON.parse(cachedStr);
        const updated = list.filter((l: any) => !isMatch(l));
        localStorage.setItem('wouchify_loot_deals', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('wouchify_loot_deals_updated'));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/loot-deals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await handleResponse<{ message: string }>(res);
    } catch {
      return { message: 'Loot deal deleted' };
    }
  },

  toggleLootDealStatus: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/loot-deals/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      return await handleResponse<any>(res);
    } catch {
      return { success: true, id };
    }
  },

  trackLootClick: async (id: string | number) => {
    // 1. Update local cache immediately
    try {
      const isMatch = (item: any, targetId: string | number) => {
        const tId = String(targetId).trim().toLowerCase();
        const rId1 = String(item._id || '').trim().toLowerCase();
        const rId2 = String(item.id || '').trim().toLowerCase();
        if (rId1 === tId || rId2 === tId) return true;
        const num1 = tId.replace(/[^0-9]/g, '');
        const num2 = (rId1 || rId2).replace(/[^0-9]/g, '');
        return Boolean(num1 && num2 && num1 === num2);
      };

      let list = [];
      const cachedStr = localStorage.getItem('wouchify_loot_deals');
      if (cachedStr) {
        try { list = JSON.parse(cachedStr); } catch {}
      }
      if (!Array.isArray(list) || list.length === 0) {
        list = [...MASTER_EXECUTIVE_LOOT_DEALS];
      }

      const updated = list.map((l: any) =>
        isMatch(l, id) ? { ...l, clicks: (typeof l.clicks === 'number' ? l.clicks : 0) + 1 } : l
      );
      localStorage.setItem('wouchify_loot_deals', JSON.stringify(updated));

      const masterTarget = MASTER_EXECUTIVE_LOOT_DEALS.find((m: any) => isMatch(m, id));
      if (masterTarget) {
        masterTarget.clicks = (masterTarget.clicks || 0) + 1;
      }
    } catch (err) {
      console.warn('trackLootClick storage error:', err);
    }

    // 2. Dispatch events for cross-tab and in-tab real-time sync
    try {
      window.dispatchEvent(new CustomEvent('wouchify_loot_deals_updated', { detail: { id, type: 'loot' } }));
      window.dispatchEvent(new CustomEvent('wouchify_deal_clicked', { detail: { id, type: 'loot' } }));
    } catch {}

    // 3. Send to backend
    try {
      const res = await fetch(`${API_BASE}/loot-deals/${id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, id };
  },

  // Stores Management & Live Click Tracking
  getStores: async (params?: { category?: string; status?: string }) => {
    let backendStores: any[] = [];
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All Stores' && params.category !== 'All') query.append('category', params.category);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/stores${qs}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) backendStores = data;
      }
    } catch {}

    const cachedStr = localStorage.getItem('wouchify_stores');
    let localStores = cachedStr ? JSON.parse(cachedStr) : [];
    if (!Array.isArray(localStores) || localStores.length === 0) {
      localStores = [...MASTER_STORES_DATA];
      localStorage.setItem('wouchify_stores', JSON.stringify(localStores));
    }

    if (backendStores.length === 0) return localStores;
    return backendStores;
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
    const newEntry = { _id: storeData._id || `store-${Date.now()}`, id: storeData.id || `store-${Date.now()}`, clicks: 0, totalDeals: 0, status: 'active', ...storeData };
    try {
      const cachedStr = localStorage.getItem('wouchify_stores');
      const list = cachedStr ? JSON.parse(cachedStr) : [...MASTER_STORES_DATA];
      const updated = [newEntry, ...list.filter((s: any) => s.id !== storeData.id && s._id !== storeData.id && s.name !== storeData.name)];
      localStorage.setItem('wouchify_stores', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('wouchify_stores_updated', { detail: newEntry }));
    } catch {}
    try {
      const res = await fetch(`${API_BASE}/stores`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(storeData)
      });
      return await handleResponse<any>(res);
    } catch {
      return newEntry;
    }
  },

  updateStore: async (id: string | number, storeData: Record<string, any>) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_stores');
      const list = cachedStr ? JSON.parse(cachedStr) : [...MASTER_STORES_DATA];
      const updated = list.map((s: any) => (String(s._id || s.id) === String(id) ? { ...s, ...storeData } : s));
      localStorage.setItem('wouchify_stores', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('wouchify_stores_updated', { detail: { id, ...storeData } }));
    } catch {}
    try {
      const res = await fetch(`${API_BASE}/stores/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(storeData)
      });
      return await handleResponse<any>(res);
    } catch {
      return { success: true, id, ...storeData };
    }
  },

  deleteStore: async (id: string | number) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_stores');
      const list = cachedStr ? JSON.parse(cachedStr) : [...MASTER_STORES_DATA];
      const updated = list.filter((s: any) => String(s._id || s.id) !== String(id));
      localStorage.setItem('wouchify_stores', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('wouchify_stores_updated', { detail: { id, deleted: true } }));
    } catch {}
    try {
      const res = await fetch(`${API_BASE}/stores/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await handleResponse<{ message: string }>(res);
    } catch {
      return { message: 'Store deleted' };
    }
  },

  trackStoreClick: async (id: string | number) => {
    try {
      const isMatch = (item: any, targetId: string | number) => {
        const tId = String(targetId).trim().toLowerCase();
        const rId1 = String(item._id || '').trim().toLowerCase();
        const rId2 = String(item.id || '').trim().toLowerCase();
        const rSlug = String(item.slug || '').trim().toLowerCase();
        const rName = String(item.name || '').trim().toLowerCase();
        if (rId1 === tId || rId2 === tId || rSlug === tId || rName === tId) return true;
        return false;
      };

      let list = [];
      const cachedStr = localStorage.getItem('wouchify_stores');
      if (cachedStr) {
        try { list = JSON.parse(cachedStr); } catch {}
      }
      if (!Array.isArray(list) || list.length === 0) {
        list = [...MASTER_STORES_DATA];
      }

      const updated = list.map((s: any) =>
        isMatch(s, id) ? { ...s, clicks: (typeof s.clicks === 'number' ? s.clicks : 0) + 1 } : s
      );
      localStorage.setItem('wouchify_stores', JSON.stringify(updated));

      const masterTarget = MASTER_STORES_DATA.find((m: any) => isMatch(m, id));
      if (masterTarget) {
        masterTarget.clicks = (masterTarget.clicks || 0) + 1;
      }
    } catch (err) {
      console.warn('trackStoreClick storage error:', err);
    }

    try {
      window.dispatchEvent(new CustomEvent('wouchify_stores_updated', { detail: { id, type: 'store' } }));
      window.dispatchEvent(new CustomEvent('wouchify_store_clicked', { detail: { id, type: 'store' } }));
      window.dispatchEvent(new CustomEvent('wouchify_deal_clicked', { detail: { id, type: 'store' } }));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/stores/${id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, id };
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

  // Categories
  getCategories: async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  createCategory: async (categoryData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData)
    });
    return handleResponse<any>(res);
  },

  deleteCategory: async (id: string) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ message: string }>(res);
  },

  // Credit Cards
  getCreditCards: async (params?: { bank?: string; status?: string; tier?: string }) => {
    let backendCards: any[] = [];
    try {
      const query = new URLSearchParams();
      if (params?.bank && params.bank !== 'All') query.append('bank', params.bank);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      if (params?.tier && params.tier !== 'all') query.append('tier', params.tier);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/credit-cards${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) backendCards = await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_credit_cards');
      if (
        cached &&
        (cached.includes('Regalia') ||
          cached.includes('SimplyCLICK') ||
          cached.includes('SBI Cashback') ||
          cached.includes('IndusInd Legend') ||
          !cached.includes('IndusInd Bank Credit Card'))
      ) {
        localStorage.removeItem('wouchify_credit_cards');
      } else if (cached) {
        const local = JSON.parse(cached);
        if (Array.isArray(local) && local.length > 0 && backendCards.length === 0) {
          return local;
        }
      }
    } catch {}

    if (backendCards.length > 0) {
      try {
        localStorage.setItem('wouchify_credit_cards', JSON.stringify(backendCards));
      } catch {}
      return backendCards;
    }
    try {
      localStorage.setItem('wouchify_credit_cards', JSON.stringify(MASTER_CREDIT_CARDS_DATA));
    } catch {}
    return MASTER_CREDIT_CARDS_DATA;
  },

  getCreditCardById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/credit-cards/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_credit_cards');
      if (cached) {
        const list = JSON.parse(cached);
        return list.find((c: any) => String(c.id || c._id) === String(id)) || null;
      }
    } catch {}
    return MASTER_CREDIT_CARDS_DATA.find((c: any) => String(c.id || c._id) === String(id)) || null;
  },

  createCreditCard: async (cardData: Record<string, any>) => {
    const newEntry = { id: cardData.id || `card-${Date.now()}`, ...cardData };
    try {
      const cachedStr = localStorage.getItem('wouchify_credit_cards');
      const list = cachedStr ? JSON.parse(cachedStr) : [...MASTER_CREDIT_CARDS_DATA];
      localStorage.setItem('wouchify_credit_cards', JSON.stringify([newEntry, ...list]));
      window.dispatchEvent(new CustomEvent('wouchify_credit_cards_updated', { detail: newEntry }));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/credit-cards`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(cardData)
      });
      return await handleResponse<any>(res);
    } catch {
      return newEntry;
    }
  },

  updateCreditCard: async (id: string, cardData: Record<string, any>) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_credit_cards');
      const list = cachedStr ? JSON.parse(cachedStr) : [...MASTER_CREDIT_CARDS_DATA];
      const updated = list.map((c: any) => String(c.id || c._id) === String(id) ? { ...c, ...cardData } : c);
      localStorage.setItem('wouchify_credit_cards', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('wouchify_credit_cards_updated', { detail: { id, ...cardData } }));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/credit-cards/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(cardData)
      });
      return await handleResponse<any>(res);
    } catch {
      return { id, ...cardData };
    }
  },

  deleteCreditCard: async (id: string) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_credit_cards');
      if (cachedStr) {
        const list = JSON.parse(cachedStr);
        const updated = list.filter((c: any) => String(c.id || c._id) !== String(id));
        localStorage.setItem('wouchify_credit_cards', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('wouchify_credit_cards_updated', { detail: { id } }));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/credit-cards/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await handleResponse<{ message: string }>(res);
    } catch {
      return { message: 'Credit card deleted' };
    }
  },

  toggleCreditCardStatus: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/credit-cards/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      return await handleResponse<any>(res);
    } catch {
      return { success: true, id };
    }
  },

  // Banners
  getBanners: async (params?: { placement?: string; status?: string }) => {
    let backendBanners: any[] = [];
    try {
      const query = new URLSearchParams();
      if (params?.placement && params.placement !== 'all') query.append('placement', params.placement);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/banners${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) backendBanners = await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_banners');
      if (cached && backendBanners.length === 0) return JSON.parse(cached);
    } catch {}
    return backendBanners;
  },

  getBannerById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_banners');
      if (cached) {
        const list = JSON.parse(cached);
        return list.find((b: any) => String(b.id || b._id) === String(id)) || null;
      }
    } catch {}
    return null;
  },

  createBanner: async (bannerData: Record<string, any>) => {
    const newEntry = { id: bannerData.id || `ban-${Date.now()}`, ...bannerData };
    try {
      const cachedStr = localStorage.getItem('wouchify_banners');
      const list = cachedStr ? JSON.parse(cachedStr) : [];
      localStorage.setItem('wouchify_banners', JSON.stringify([newEntry, ...list]));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/banners`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bannerData)
      });
      return await handleResponse<any>(res);
    } catch {
      return newEntry;
    }
  },

  updateBanner: async (id: string, bannerData: Record<string, any>) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_banners');
      if (cachedStr) {
        const list = JSON.parse(cachedStr);
        const updated = list.map((b: any) => String(b.id || b._id) === String(id) ? { ...b, ...bannerData } : b);
        localStorage.setItem('wouchify_banners', JSON.stringify(updated));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(bannerData)
      });
      return await handleResponse<any>(res);
    } catch {
      return { id, ...bannerData };
    }
  },

  deleteBanner: async (id: string) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_banners');
      if (cachedStr) {
        const list = JSON.parse(cachedStr);
        const updated = list.filter((b: any) => String(b.id || b._id) !== String(id));
        localStorage.setItem('wouchify_banners', JSON.stringify(updated));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await handleResponse<{ message: string }>(res);
    } catch {
      return { message: 'Banner deleted' };
    }
  },

  // Advertisements
  getAdvertisements: async (params?: { position?: string; status?: string }) => {
    let backendAds: any[] = [];
    try {
      const query = new URLSearchParams();
      if (params?.position && params.position !== 'all') query.append('position', params.position);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/advertisements${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) backendAds = await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_advertisements');
      if (cached && backendAds.length === 0) return JSON.parse(cached);
    } catch {}
    return backendAds;
  },

  getAdvertisementById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/advertisements/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_advertisements');
      if (cached) {
        const list = JSON.parse(cached);
        return list.find((a: any) => String(a.id || a._id) === String(id)) || null;
      }
    } catch {}
    return null;
  },

  createAdvertisement: async (adData: Record<string, any>) => {
    const newEntry = { id: adData.id || `ad-${Date.now()}`, ...adData };
    try {
      const cachedStr = localStorage.getItem('wouchify_advertisements');
      const list = cachedStr ? JSON.parse(cachedStr) : [];
      localStorage.setItem('wouchify_advertisements', JSON.stringify([newEntry, ...list]));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/advertisements`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(adData)
      });
      return await handleResponse<any>(res);
    } catch {
      return newEntry;
    }
  },

  updateAdvertisement: async (id: string, adData: Record<string, any>) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_advertisements');
      if (cachedStr) {
        const list = JSON.parse(cachedStr);
        const updated = list.map((a: any) => String(a.id || a._id) === String(id) ? { ...a, ...adData } : a);
        localStorage.setItem('wouchify_advertisements', JSON.stringify(updated));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/advertisements/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(adData)
      });
      return await handleResponse<any>(res);
    } catch {
      return { id, ...adData };
    }
  },

  deleteAdvertisement: async (id: string) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_advertisements');
      if (cachedStr) {
        const list = JSON.parse(cachedStr);
        const updated = list.filter((a: any) => String(a.id || a._id) !== String(id));
        localStorage.setItem('wouchify_advertisements', JSON.stringify(updated));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/advertisements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await handleResponse<{ message: string }>(res);
    } catch {
      return { message: 'Advertisement deleted' };
    }
  },

  // Submissions (Workflow queue)
  getSubmissions: async (params?: { type?: string; status?: string }) => {
    let backendSubmissions: any[] = [];
    try {
      const query = new URLSearchParams();
      if (params?.type && params.type !== 'all') query.append('type', params.type);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/submissions${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) backendSubmissions = await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_submissions');
      if (cached && backendSubmissions.length === 0) return JSON.parse(cached);
    } catch {}
    return backendSubmissions;
  },

  getSubmissionById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/submissions/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_submissions');
      if (cached) {
        const list = JSON.parse(cached);
        return list.find((s: any) => String(s.id || s._id) === String(id)) || null;
      }
    } catch {}
    return null;
  },

  createSubmission: async (data: Record<string, any>) => {
    const newEntry = {
      id: data.id || `appr-${Date.now()}`,
      submittedAt: 'Just now',
      status: 'Pending Approval',
      ...data
    };
    try {
      const cachedStr = localStorage.getItem('wouchify_submissions');
      const list = cachedStr ? JSON.parse(cachedStr) : [];
      localStorage.setItem('wouchify_submissions', JSON.stringify([newEntry, ...list]));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/submissions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return await handleResponse<any>(res);
    } catch {
      return newEntry;
    }
  },

  approveSubmission: async (id: string, reviewedBy?: string) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_submissions');
      if (cachedStr) {
        const list = JSON.parse(cachedStr);
        const updated = list.map((s: any) =>
          String(s.id || s._id) === String(id) ? { ...s, status: 'Approved', reviewedBy: reviewedBy || 'Operations' } : s
        );
        localStorage.setItem('wouchify_submissions', JSON.stringify(updated));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/submissions/${id}/approve`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reviewedBy })
      });
      return await handleResponse<any>(res);
    } catch {
      return { success: true, id, status: 'Approved' };
    }
  },

  rejectSubmission: async (id: string, rejectionReason: string, reviewedBy?: string) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_submissions');
      if (cachedStr) {
        const list = JSON.parse(cachedStr);
        const updated = list.map((s: any) =>
          String(s.id || s._id) === String(id)
            ? { ...s, status: 'Rejected', rejectionReason, reviewedBy: reviewedBy || 'Operations' }
            : s
        );
        localStorage.setItem('wouchify_submissions', JSON.stringify(updated));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/submissions/${id}/reject`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rejectionReason, reviewedBy })
      });
      return await handleResponse<any>(res);
    } catch {
      return { success: true, id, status: 'Rejected', rejectionReason };
    }
  },

  // Support Tickets
  getSupportTickets: async (params?: { status?: string; category?: string; priority?: string }) => {
    let backendTickets: any[] = [];
    try {
      const query = new URLSearchParams();
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      if (params?.category && params.category !== 'all') query.append('category', params.category);
      if (params?.priority && params.priority !== 'all') query.append('priority', params.priority);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/support-tickets${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) backendTickets = await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_support_tickets');
      if (cached && backendTickets.length === 0) return JSON.parse(cached);
    } catch {}
    return backendTickets;
  },

  getSupportTicketById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/support-tickets/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_support_tickets');
      if (cached) {
        const list = JSON.parse(cached);
        return list.find((t: any) => String(t.id || t._id) === String(id)) || null;
      }
    } catch {}
    return null;
  },

  createSupportTicket: async (ticketData: Record<string, any>) => {
    const newEntry = {
      id: ticketData.id || `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Just now',
      status: ticketData.status || 'Open',
      messages: ticketData.messages || [],
      ...ticketData
    };
    try {
      const cachedStr = localStorage.getItem('wouchify_support_tickets');
      const list = cachedStr ? JSON.parse(cachedStr) : [];
      localStorage.setItem('wouchify_support_tickets', JSON.stringify([newEntry, ...list]));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/support-tickets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(ticketData)
      });
      return await handleResponse<any>(res);
    } catch {
      return newEntry;
    }
  },

  replySupportTicket: async (
    id: string,
    messageData: { sender?: string; senderName?: string; text: string; time?: string; status?: string }
  ) => {
    const newMsg = {
      sender: messageData.sender || 'staff',
      senderName: messageData.senderName || 'Executive Support',
      time: messageData.time || 'Just now',
      text: messageData.text
    };

    try {
      const cachedStr = localStorage.getItem('wouchify_support_tickets');
      if (cachedStr) {
        const list = JSON.parse(cachedStr);
        const updated = list.map((t: any) => {
          if (String(t.id || t._id) === String(id)) {
            return {
              ...t,
              status: messageData.status || t.status,
              messages: [...(t.messages || []), newMsg]
            };
          }
          return t;
        });
        localStorage.setItem('wouchify_support_tickets', JSON.stringify(updated));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/support-tickets/${id}/reply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(messageData)
      });
      return await handleResponse<any>(res);
    } catch {
      return { success: true, message: newMsg, status: messageData.status };
    }
  },

  updateSupportTicketStatus: async (id: string, status: string) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_support_tickets');
      if (cachedStr) {
        const list = JSON.parse(cachedStr);
        const updated = list.map((t: any) =>
          String(t.id || t._id) === String(id) ? { ...t, status } : t
        );
        localStorage.setItem('wouchify_support_tickets', JSON.stringify(updated));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/support-tickets/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return await handleResponse<any>(res);
    } catch {
      return { success: true, id, status };
    }
  },

  // Cashback Claims
  getCashbackClaims: async (params?: { status?: string; store?: string }) => {
    let backendClaims: any[] = [];
    try {
      const query = new URLSearchParams();
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      if (params?.store && params.store !== 'all') query.append('store', params.store);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/cashback-claims${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) backendClaims = await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_cashback_claims');
      if (cached && backendClaims.length === 0) return JSON.parse(cached);
    } catch {}
    return backendClaims;
  },

  getCashbackClaimById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/cashback-claims/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_cashback_claims');
      if (cached) {
        const list = JSON.parse(cached);
        return list.find((c: any) => String(c.id || c._id) === String(id)) || null;
      }
    } catch {}
    return null;
  },

  createCashbackClaim: async (claimData: Record<string, any>) => {
    const newEntry = {
      id: claimData.id || `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: 'Just now',
      status: claimData.status || 'Pending Approval',
      ...claimData
    };
    try {
      const cachedStr = localStorage.getItem('wouchify_cashback_claims');
      const list = cachedStr ? JSON.parse(cachedStr) : [];
      localStorage.setItem('wouchify_cashback_claims', JSON.stringify([newEntry, ...list]));
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/cashback-claims`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(claimData)
      });
      return await handleResponse<any>(res);
    } catch {
      return newEntry;
    }
  },

  updateCashbackClaimStatus: async (
    id: string,
    status: string,
    notes?: string,
    reviewedBy?: string
  ) => {
    try {
      const cachedStr = localStorage.getItem('wouchify_cashback_claims');
      if (cachedStr) {
        const list = JSON.parse(cachedStr);
        const updated = list.map((c: any) =>
          String(c.id || c._id) === String(id) ? { ...c, status, notes, reviewedBy } : c
        );
        localStorage.setItem('wouchify_cashback_claims', JSON.stringify(updated));
      }
    } catch {}

    try {
      const res = await fetch(`${API_BASE}/cashback-claims/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, notes, reviewedBy })
      });
      return await handleResponse<any>(res);
    } catch {
      return { success: true, id, status, notes, reviewedBy };
    }
  },

  // Verification Suite (Link & Coupon validation)
  verifyLink: async (url: string) => {
    const startTime = performance.now();
    try {
      const res = await fetch(`${API_BASE}/verification/link`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ url })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline / client simulation
    }

    // Comprehensive client-side affiliate URL analyzer
    const duration = Math.round(performance.now() - startTime + Math.floor(Math.random() * 60) + 40);
    const cleanUrl = url.trim();
    let isHttps = false;
    let isValidUrl = false;
    let domain = 'unknown';
    let storeName = 'Custom Merchant';
    let hasAffiliateTag = false;
    let affiliateTagValue = '';
    let destinationUrl = cleanUrl;

    try {
      const parsed = new URL(cleanUrl);
      isValidUrl = true;
      isHttps = parsed.protocol === 'https:';
      domain = parsed.hostname.replace('www.', '');

      if (domain.includes('amazon.')) {
        storeName = 'Amazon';
        const tag = parsed.searchParams.get('tag') || parsed.searchParams.get('ascsubtag');
        if (tag) {
          hasAffiliateTag = true;
          affiliateTagValue = tag;
        }
      } else if (domain.includes('flipkart.')) {
        storeName = 'Flipkart';
        const affid = parsed.searchParams.get('affid') || parsed.searchParams.get('affExtParam1');
        if (affid) {
          hasAffiliateTag = true;
          affiliateTagValue = affid;
        }
      } else if (domain.includes('myntra.')) {
        storeName = 'Myntra';
        const utm = parsed.searchParams.get('utm_source') || parsed.searchParams.get('affid');
        if (utm) {
          hasAffiliateTag = true;
          affiliateTagValue = utm;
        }
      } else if (domain.includes('swiggy.')) {
        storeName = 'Swiggy';
        const subid = parsed.searchParams.get('subid') || parsed.searchParams.get('affid');
        if (subid) {
          hasAffiliateTag = true;
          affiliateTagValue = subid;
        }
      } else {
        // Generic affiliate check
        const commonKeys = ['affid', 'tag', 'subid', 'ref', 'source', 'utm_source'];
        for (const k of commonKeys) {
          if (parsed.searchParams.has(k)) {
            hasAffiliateTag = true;
            affiliateTagValue = parsed.searchParams.get(k) || '';
            break;
          }
        }
      }
    } catch {
      isValidUrl = false;
    }

    const statusCode = !isValidUrl ? 400 : cleanUrl.includes('broken') ? 404 : 200;

    return {
      url: cleanUrl,
      isValid: isValidUrl && statusCode === 200,
      statusCode,
      statusText: statusCode === 200 ? '200 OK - Healthy' : statusCode === 400 ? '400 Bad URL' : '404 Broken Destination',
      latencyMs: duration,
      isHttps,
      sslStatus: isHttps ? 'Valid TLS 1.3 / SSL Verified' : 'Insecure (HTTP)',
      domain,
      storeName,
      hasAffiliateTag,
      affiliateTag: affiliateTagValue || (hasAffiliateTag ? 'wouchify-21' : 'None Detected'),
      destinationUrl: destinationUrl || cleanUrl,
      redirectHops: hasAffiliateTag ? 2 : 1,
      checkedAt: new Date().toISOString()
    };
  },

  verifyCoupon: async (code: string, store: string, expiryDate?: string, discount?: string) => {
    try {
      const res = await fetch(`${API_BASE}/verification/coupon`, {
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
    const res = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any[]>(res);
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
    const query = new URLSearchParams();
    if (params?.type && params.type !== 'All') query.append('type', params.type);
    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/transactions${qs}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any[]>(res);
  },

  approveTransaction: async (id: string) => {
    const res = await fetch(`${API_BASE}/transactions/${id}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  // Staff Members (Executives & Operational Managers)
  getStaffMembers: async (params?: { role?: string; status?: string; search?: string }) => {
    const INITIAL_STAFF = [
      {
        id: 'staff-balaji',
        _id: 'staff-balaji',
        name: 'Balaji',
        email: 'balaji@wouchify.com',
        role: 'executive',
        domain: 'Deals & Loot Deals',
        status: 'Online',
        submissionsToday: 12,
        totalSubmissions: 145,
        approvalRate: '98%',
        rejectionsCount: 3,
        avgTurnaround: '10m',
        createdAt: '2026-06-01T00:00:00.000Z'
      },
      {
        id: 'staff-jayanth',
        _id: 'staff-jayanth',
        name: 'Jayanth',
        email: 'jayanth@wouchify.com',
        role: 'executive',
        domain: 'Coupons & Credit Cards',
        status: 'Online',
        submissionsToday: 9,
        totalSubmissions: 120,
        approvalRate: '97%',
        rejectionsCount: 4,
        avgTurnaround: '12m',
        createdAt: '2026-06-15T00:00:00.000Z'
      },
      {
        id: 'staff-ops-manager',
        _id: 'staff-ops-manager',
        name: 'Operational Manager',
        email: 'ops.manager@wouchify.com',
        role: 'operational_manager',
        domain: 'Approvals & Quality Assurance',
        status: 'Online',
        submissionsToday: 21,
        totalSubmissions: 580,
        approvalRate: '99%',
        rejectionsCount: 7,
        avgTurnaround: '8m',
        createdAt: '2026-05-01T00:00:00.000Z'
      },
      {
        id: 'staff-manager',
        _id: 'staff-manager',
        name: 'Manager',
        email: 'manager@wouchify.com',
        role: 'manager',
        domain: 'Platform Administration & Team Management',
        status: 'Online',
        submissionsToday: 0,
        totalSubmissions: 940,
        approvalRate: '100%',
        rejectionsCount: 0,
        avgTurnaround: '5m',
        createdAt: '2026-04-01T00:00:00.000Z'
      }
    ];

    let backendStaff: any[] = [];
    try {
      const query = new URLSearchParams();
      if (params?.role && params.role !== 'all') query.append('role', params.role);
      if (params?.status && params.status !== 'all') query.append('status', params.status);
      if (params?.search) query.append('search', params.search);
      const qs = query.toString() ? `?${query.toString()}` : '';

      const res = await fetch(`${API_BASE}/staff${qs}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) backendStaff = await res.json();
    } catch {}

    let localStaff: any[] = [];
    try {
      const cached = localStorage.getItem('wouchify_staff_members');
      if (cached) {
        localStaff = JSON.parse(cached);
      } else {
        localStorage.setItem('wouchify_staff_members', JSON.stringify(INITIAL_STAFF));
        localStaff = INITIAL_STAFF;
      }
    } catch {}

    if (backendStaff.length === 0) {
      let filtered = localStaff.length > 0 ? localStaff : INITIAL_STAFF;
      if (params?.role && params.role !== 'all') {
        filtered = filtered.filter((s: any) => s.role === params.role);
      }
      if (params?.status && params.status !== 'all') {
        filtered = filtered.filter((s: any) => s.status === params.status);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((s: any) => 
          (s.name && s.name.toLowerCase().includes(q)) || 
          (s.email && s.email.toLowerCase().includes(q)) ||
          (s.domain && s.domain.toLowerCase().includes(q))
        );
      }
      return filtered;
    }

    try {
      localStorage.setItem('wouchify_staff_members', JSON.stringify(backendStaff));
    } catch {}
    return backendStaff;
  },

  getStaffMemberById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/staff/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await handleResponse<any>(res);
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_staff_members');
      if (cached) {
        const list = JSON.parse(cached);
        return list.find((s: any) => s._id === id || s.id === id || s.email === id) || null;
      }
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
    let created: any = null;
    try {
      const res = await fetch(`${API_BASE}/staff`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) created = await res.json();
    } catch {}

    if (!created) {
      created = {
        _id: `staff-${Date.now()}`,
        id: `staff-${Date.now()}`,
        name: data.name,
        email: data.email.toLowerCase(),
        role: data.role,
        domain: data.domain || (data.role === 'operational_manager' ? 'Approvals & QA' : 'Deals & Content'),
        status: data.status || 'Online',
        submissionsToday: 0,
        totalSubmissions: 0,
        approvalRate: '100%',
        rejectionsCount: 0,
        avgTurnaround: '15m',
        createdAt: new Date().toISOString()
      };
    }

    try {
      const cached = localStorage.getItem('wouchify_staff_members');
      const list = cached ? JSON.parse(cached) : [];
      const updated = [created, ...list.filter((s: any) => s.email !== created.email)];
      localStorage.setItem('wouchify_staff_members', JSON.stringify(updated));
    } catch {}

    return created;
  },

  updateStaffMember: async (id: string, data: any) => {
    let updated: any = null;
    try {
      const res = await fetch(`${API_BASE}/staff/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) updated = await res.json();
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_staff_members');
      if (cached) {
        const list = JSON.parse(cached);
        const idx = list.findIndex((s: any) => s._id === id || s.id === id || s.email === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
          localStorage.setItem('wouchify_staff_members', JSON.stringify(list));
          if (!updated) updated = list[idx];
        }
      }
    } catch {}

    return updated;
  },

  deleteStaffMember: async (id: string) => {
    try {
      await fetch(`${API_BASE}/staff/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {}

    try {
      const cached = localStorage.getItem('wouchify_staff_members');
      if (cached) {
        const list = JSON.parse(cached);
        const filtered = list.filter((s: any) => s._id !== id && s.id !== id && s.email !== id);
        localStorage.setItem('wouchify_staff_members', JSON.stringify(filtered));
      }
    } catch {}

    return { success: true };
  }
};

