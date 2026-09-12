// Wouchify Admin REST API Client Service

const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('adminToken') || '';
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

    // Always merge with localStorage deals so custom deals are never lost
    let localDeals: any[] = [];
    try {
      const cached = localStorage.getItem('wouchify_public_deals');
      if (cached) localDeals = JSON.parse(cached);
    } catch {}

    if (backendDeals.length === 0 && localDeals.length > 0) {
      return localDeals;
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
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  },

  createDeal: async (dealData: Record<string, any>) => {
    const newEntry = { _id: dealData._id || String(Date.now()), id: dealData.id || Date.now(), ...dealData };
    try {
      // Sync to localStorage immediately for cross-tab reactivity
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

    const res = await fetch(`${API_BASE}/deals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(dealData)
    });
    return handleResponse<any>(res);
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

    const res = await fetch(`${API_BASE}/deals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ message: string }>(res);
  },

  toggleDealStatus: async (id: string | number) => {
    const res = await fetch(`${API_BASE}/deals/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  // Coupons
  getCoupons: async () => {
    const res = await fetch(`${API_BASE}/coupons`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any[]>(res);
  },

  createCoupon: async (couponData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(couponData)
    });
    return handleResponse<any>(res);
  },

  updateCoupon: async (id: string | number, couponData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(couponData)
    });
    return handleResponse<any>(res);
  },

  deleteCoupon: async (id: string | number) => {
    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ message: string }>(res);
  },

  // Loot Deals
  getLootDeals: async (params?: { dealType?: string }) => {
    const query = new URLSearchParams();
    if (params?.dealType && params.dealType !== 'All') query.append('dealType', params.dealType);
    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/loot-deals${qs}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any[]>(res);
  },

  createLootDeal: async (lootData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/loot-deals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(lootData)
    });
    return handleResponse<any>(res);
  },

  updateLootDeal: async (id: string, lootData: Record<string, any>) => {
    const res = await fetch(`${API_BASE}/loot-deals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(lootData)
    });
    return handleResponse<any>(res);
  },

  deleteLootDeal: async (id: string) => {
    const res = await fetch(`${API_BASE}/loot-deals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ message: string }>(res);
  },

  toggleLootDealStatus: async (id: string) => {
    const res = await fetch(`${API_BASE}/loot-deals/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  // Stores
  getStores: async () => {
    const res = await fetch(`${API_BASE}/stores`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any[]>(res);
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
    return handleResponse<any>(res);
  },

  deleteStore: async (id: string) => {
    const res = await fetch(`${API_BASE}/stores/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ message: string }>(res);
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
    const res = await fetch(`${API_BASE}/categories`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any[]>(res);
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
  }
};
