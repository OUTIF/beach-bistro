# Twenty Beach Bistro — QR Menu System

Plain HTML + CSS + JS. No frameworks. No build step.

## File Structure

```
beach-bistro/
├── index.html              ← Home / Reservation (public)
├── pages/
│   ├── menu.html           ← Menu — QR code target (public)
│   ├── admin.html          ← Admin login
│   ├── dashboard.html      ← Reservations management (admin only)
│   └── edit-menu.html      ← Menu CRUD (admin only)
├── css/
│   ├── style.css           ← Shared styles
│   └── admin.css           ← Admin-only styles
├── js/
│   ├── config.js           ← ⚠️  PUT YOUR SUPABASE KEYS HERE
│   └── api.js              ← All Supabase REST calls
├── schema.sql              ← Run once in Supabase SQL Editor
├── .env                    ← Your secrets (never commit)
├── .env.example            ← Safe template
└── .gitignore
```
## Setup (5 steps)

1. **Create free Supabase project** at https://supabase.com
2. **Run schema.sql** in Supabase → SQL Editor
3. **Edit `js/config.js`** — paste your Supabase URL and anon key
4. **Create admin user**: Supabase → Authentication → Users → Invite user
5. **Open `index.html`** in a browser (or deploy to any static host)

## Deploy (free options)
- **Netlify**: drag & drop the folder at netlify.com/drop
- **Vercel**: `npx vercel` in this folder
- **GitHub Pages**: push to repo → Settings → Pages

## Routes
| Page | URL | Access |
|---|---|---|
| Home | `/index.html` | Public |
| Menu | `/pages/menu.html` | Public — use as QR target |
| Admin Login | `/pages/admin.html` | Public |
| Reservations | `/pages/dashboard.html` | Admin only |
| Edit Menu | `/pages/edit-menu.html` | Admin only |

## Security
- Admin session stored in `sessionStorage` — cleared on tab close, zero cookies
- Supabase RLS: public can only read menu + submit reservations
- Admin CRUD requires authenticated Supabase JWT
