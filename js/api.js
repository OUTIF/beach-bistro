// ─── Supabase REST helpers ────────────────────────────────────────────────────

function _headers(token) {
  const h = {
    'Content-Type':  'application/json',
    'apikey':        SUPABASE_ANON_KEY,
    'Authorization': token ? `Bearer ${token}` : `Bearer ${SUPABASE_ANON_KEY}`,
  }
  return h
}

function _url(table, query) {
  return `${SUPABASE_URL}/rest/v1/${table}${query || ''}`
}

// ── AUTH ──────────────────────────────────────────────────────────────────────

async function authLogin(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Login failed')
  // Store in sessionStorage — zero cookies
  sessionStorage.setItem('bb_token',  data.access_token)
  sessionStorage.setItem('bb_email',  email)
  sessionStorage.setItem('bb_exp',    String(Date.now() + data.expires_in * 1000))
}

function authLogout() {
  sessionStorage.removeItem('bb_token')
  sessionStorage.removeItem('bb_email')
  sessionStorage.removeItem('bb_exp')
}

function authToken() {
  const exp = Number(sessionStorage.getItem('bb_exp') || 0)
  if (Date.now() > exp) { authLogout(); return null }
  return sessionStorage.getItem('bb_token')
}

function isLoggedIn() { return !!authToken() }

// ── MENU ──────────────────────────────────────────────────────────────────────

async function menuFetch() {
  const res = await fetch(
    _url('menu_items', '?select=*&order=category,name'),
    { headers: _headers() }
  )
  if (!res.ok) throw new Error('Failed to load menu')
  return res.json()
}

async function menuCreate(item) {
  const res = await fetch(_url('menu_items'), {
    method: 'POST',
    headers: { ..._headers(authToken()), 'Prefer': 'return=minimal' },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error('Failed to create item')
}

async function menuUpdate(id, patch) {
  const res = await fetch(_url('menu_items', `?id=eq.${id}`), {
    method: 'PATCH',
    headers: { ..._headers(authToken()), 'Prefer': 'return=minimal' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw new Error('Failed to update item')
}

async function menuDelete(id) {
  const res = await fetch(_url('menu_items', `?id=eq.${id}`), {
    method: 'DELETE',
    headers: _headers(authToken()),
  })
  if (!res.ok) throw new Error('Failed to delete item')
}

// ── RESERVATIONS ──────────────────────────────────────────────────────────────

async function reservationCreate(data) {
  const res = await fetch(_url('reservations'), {
    method: 'POST',
    headers: { ..._headers(), 'Prefer': 'return=minimal' },
    body: JSON.stringify({ ...data, status: 'pending' }),
  })
  if (!res.ok) throw new Error('Failed to submit reservation')
}

async function reservationsFetch() {
  // Active reservations only (not soft-deleted)
  const res = await fetch(
    _url('reservations', '?select=*&order=date_time&deleted_at=is.null'),
    { headers: _headers(authToken()) }
  )
  if (!res.ok) throw new Error('Failed to load reservations')
  return res.json()
}

async function reservationsFetchAll() {
  // All reservations including soft-deleted — for admin archive view
  const res = await fetch(
    _url('reservations', '?select=*&order=date_time'),
    { headers: _headers(authToken()) }
  )
  if (!res.ok) throw new Error('Failed to load reservations')
  return res.json()
}

async function reservationUpdateStatus(id, status) {
  const res = await fetch(_url('reservations', `?id=eq.${id}`), {
    method: 'PATCH',
    headers: { ..._headers(authToken()), 'Prefer': 'return=minimal' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update reservation')
}

async function reservationDelete(id) {
  // Soft-delete: stamp deleted_at instead of destroying the row
  const res = await fetch(_url('reservations', `?id=eq.${id}`), {
    method: 'PATCH',
    headers: { ..._headers(authToken()), 'Prefer': 'return=minimal' },
    body: JSON.stringify({ deleted_at: new Date().toISOString() }),
  })
  if (!res.ok) throw new Error('Failed to delete reservation')
}

async function reservationHardDelete(id) {
  // Permanent delete — only used from the archive view
  const res = await fetch(_url('reservations', `?id=eq.${id}`), {
    method: 'DELETE',
    headers: _headers(authToken()),
  })
  if (!res.ok) throw new Error('Failed to permanently delete reservation')
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────

async function categoriesFetch() {
  const res = await fetch(
    _url('categories', '?select=*&order=sort_order,name'),
    { headers: _headers() }
  )
  if (!res.ok) throw new Error('Failed to load categories')
  return res.json()
}

async function categoryCreate(data) {
  const res = await fetch(_url('categories'), {
    method: 'POST',
    headers: { ..._headers(authToken()), 'Prefer': 'return=minimal' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to create category')
  }
}

async function categoryUpdate(id, patch) {
  const res = await fetch(_url('categories', `?id=eq.${id}`), {
    method: 'PATCH',
    headers: { ..._headers(authToken()), 'Prefer': 'return=minimal' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw new Error('Failed to update category')
}

async function categoryDelete(id) {
  const res = await fetch(_url('categories', `?id=eq.${id}`), {
    method: 'DELETE',
    headers: _headers(authToken()),
  })
  if (!res.ok) throw new Error('Failed to delete category')
}