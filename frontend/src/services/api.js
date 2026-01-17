const baseUrl = process.env.REACT_APP_BACKEND_URL || '';

const getToken = () => localStorage.getItem('token');

async function request(path, options = {}) {
  const headers = options.headers || {};
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Normalize URL so callers can pass either '/analyses' or '/api/analyses' or full URLs
  let urlToFetch;
  if (path.startsWith('http') || (baseUrl && path.startsWith(baseUrl))) {
    urlToFetch = path;
  } else {
    urlToFetch = `${baseUrl}${path}`;
  }

  const res = await fetch(urlToFetch, { ...options, headers });

  const contentType = res.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/pdf')) {
    data = await res.blob();
  } else {
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = text;
    }
  }

  if (!res.ok) {
    const error = (data && typeof data === 'object' && data.error) || res.statusText || 'Request failed';
    const err = new Error(error);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export async function apiGet(path, params) {
  const search = params ? `?${new URLSearchParams(params).toString()}` : '';
  const fullPath = `${path}${search}`;
  return request(fullPath, { method: 'GET' });
}

export async function apiPost(path, body) {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
}

export async function apiPut(path, body) {
  return request(path, { method: 'PUT', body: JSON.stringify(body) });
}

export async function apiPatch(path, body) {
  return request(path, { method: 'PATCH', body: JSON.stringify(body) });
}

export async function apiDelete(path) {
  return request(path, { method: 'DELETE' });
}

// small ad-hoc cache for dashboard stats to avoid refetch on rapid interactions
const cache = new Map();
export async function cachedGet(path, { ttl = 5000 } = {}) {
  const key = path;
  const now = Date.now();
  const entry = cache.get(key);
  if (entry && (now - entry.ts) < ttl) return entry.data;
  const data = await apiGet(path);
  cache.set(key, { ts: now, data });
  return data;
}

export default { apiGet, apiPost, apiPut, apiPatch, apiDelete, cachedGet };
