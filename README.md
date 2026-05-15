# raastey status

Public system status and release notes at [status.raastey.app](https://status.raastey.app).

Static [Astro](https://astro.build) site deployed to GitHub Pages. Tracked in Linear as [RAA-166](https://linear.app/factoura/issue/RAA-166).

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Overall status banner + component health rows |
| `/history` | Past incidents (empty until something is posted) |
| `/releases` | Writer-readable release notes from JSON |

## DNS setup (GitHub Pages custom domain)

1. Create a GitHub repo (e.g. `raastey/raastey-status`) and push this project to `main`.
2. In the repo: **Settings → Pages → Build and deployment** → Source: **GitHub Actions**.
3. After the first successful deploy, set **Custom domain** to `status.raastey.app` and enable **Enforce HTTPS**.
4. At your DNS provider, add a **CNAME** record:
   - **Name:** `status` (or `status.raastey.app` depending on provider)
   - **Target:** `<org>.github.io` (e.g. `raastey.github.io`)
5. `public/CNAME` in this repo already contains `status.raastey.app` so Pages keeps the mapping on deploy.

Verify with `dig status.raastey.app CNAME` once DNS propagates.

## Updating status

### Component health (`status-data/components.json`)

Edit each component’s `status`:

- `operational` — working normally
- `degraded` — slower or partial impact
- `partial_outage` — significant subset affected
- `outage` — unavailable
- `maintenance` — planned work

Bump `updatedAt` to an ISO-8601 UTC timestamp, commit, and push to `main`. The deploy workflow rebuilds the site.

### Incidents (`status-data/incidents.json`)

Add objects that match `status-data/incidents.schema.json`. Each incident needs `id`, `title`, `status`, `impact`, `createdAt`, and `updates[]`. Resolved incidents stay in the file for `/history`.

### Releases (`status-data/releases.json`)

**Manual:** edit JSON directly.

**From product repo:** when `../the-ways/RELEASE_NOTES.md` exists (sibling checkout):

```bash
npm run sync-releases
# or: node scripts/sync-releases.mjs /path/to/RELEASE_NOTES.md
```

Commit the updated `status-data/releases.json` and push.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

## Project layout

```text
status-data/          # JSON source of truth (committed)
  components.json
  incidents.json
  incidents.schema.json
  releases.json
scripts/
  sync-releases.mjs   # RELEASE_NOTES.md → releases.json
src/
  pages/              # index, history, releases
public/
  CNAME               # status.raastey.app
.github/workflows/
  deploy.yml          # GitHub Pages (Actions)
```

## Related

- Product release narrative: `the-ways/RELEASE_NOTES.md`
- Technical changelog: `the-ways/CHANGELOG.md`
- Linear: [RAA-166 — status.raastey.app](https://linear.app/factoura/issue/RAA-166)
