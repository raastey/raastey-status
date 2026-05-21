# roono status

Public system status and release notes at [status.roono.app](https://status.roono.app).

Static [Astro](https://astro.build) site deployed to GitHub Pages. Tracked in Linear as [RAA-166](https://linear.app/factoura/issue/RAA-166) / refresh [RAA-275](https://linear.app/factoura/issue/RAA-275).

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Overall status banner + component health rows |
| `/history` | Past incidents (empty until something is posted) |
| `/releases` | Writer-readable release notes from JSON |
| `/status.json` | Machine-readable feed for writer and roono-jr in-app banners |

## DNS setup (GitHub Pages custom domain)

1. Repo: [raastey/roono-status](https://github.com/raastey/roono-status) on `main`.
2. **Settings → Pages → Build and deployment** → Source: **GitHub Actions**.
3. **Custom domain:** `status.roono.app`, **Enforce HTTPS** on.
4. DNS **CNAME:** `status` → `raastey.github.io` (GitHub org username, not the repo name).
5. `public/CNAME` contains `status.roono.app` so Pages keeps the mapping on deploy.

Verify with `dig status.roono.app CNAME` once DNS propagates.

## Updating status

### Component health (`status-data/components.json`)

Edit each component’s `status`:

- `operational` — working normally
- `degraded` — slower or partial impact
- `partial_outage` — significant subset affected
- `outage` — unavailable
- `maintenance` — planned work

Bump `updatedAt` to an ISO-8601 UTC timestamp, commit, and push to `main`. CI rebuilds the site and regenerates `public/status.json`.

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

### In-app feed (`status.json`)

`npm run build` runs `scripts/build-status-json.mjs`, which merges `components.json` + active incidents into `public/status.json` for polling (writer: `VITE_STATUS_URL=https://status.roono.app/status.json`).

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
  sync-releases.mjs       # RELEASE_NOTES.md → releases.json
  build-status-json.mjs   # components + incidents → public/status.json
src/
  pages/              # index, history, releases
public/
  CNAME               # status.roono.app
  status.json         # generated at build (also committed for visibility)
.github/workflows/
  deploy.yml          # GitHub Pages (Actions)
```

## Related

- Product release narrative: `the-ways/RELEASE_NOTES.md`
- Technical changelog: `the-ways/CHANGELOG.md`
- Linear: [RAA-166 — status.roono.app](https://linear.app/factoura/issue/RAA-166)
