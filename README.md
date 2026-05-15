# raastey status

Public system status and release notes for [raastey](https://www.raastey.app), hosted on **GitHub Pages** at **https://status.raastey.app**.

Tracked in Linear: [RAA-166](https://linear.app/factoura/issue/RAA-166) · Notion: [status.raastey.app spec](https://www.notion.so/361d508f2aac812e85fdd8f551772f48)

## Pages

| Path | Purpose |
|------|---------|
| `/` | Component status (Writer, API, Marketing, LanguageTool) |
| `/history/` | Past incidents |
| `/releases/` | Writer-readable release notes |

Design references: [GitHub Status](https://www.githubstatus.com/), [Claude Status](https://status.claude.com/).

## Local development

```bash
npm ci
npm run dev
```

Open http://localhost:4321

## Update operational status

Edit `status-data/components.json`:

- Set each component `status` to `operational`, `degraded`, `partial_outage`, `major_outage`, or `maintenance`
- Bump `updatedAt` to the current ISO timestamp
- Commit and push to `main` — GitHub Actions deploys automatically

## Update release notes

Release narrative is sourced from [`the-ways/RELEASE_NOTES.md`](https://github.com/raastey/the-ways/blob/main/RELEASE_NOTES.md):

```bash
# With the-ways cloned as a sibling directory:
npm run sync:releases

# Or point at a checkout:
RELEASE_NOTES_PATH=/path/to/the-ways/RELEASE_NOTES.md npm run sync:releases
```

`prebuild` runs the sync script when the file is found. You can also edit `status-data/releases.json` directly for urgent publishes.

## Report an incident

Append to `status-data/incidents.json`:

```json
{
  "id": "2026-05-15-writer-degraded",
  "title": "Elevated errors on Writer",
  "impact": "degraded",
  "startedAt": "2026-05-15T14:00:00Z",
  "resolvedAt": "2026-05-15T15:30:00Z",
  "components": ["writer", "api"],
  "updates": [
    {
      "at": "2026-05-15T14:00:00Z",
      "status": "degraded",
      "body": "We are investigating elevated 5xx responses on the writer app."
    },
    {
      "at": "2026-05-15T15:30:00Z",
      "status": "operational",
      "body": "The issue is resolved. All systems are operational."
    }
  ]
}
```

Set affected components to `degraded` or worse in `components.json` while the incident is open.

## Custom domain (director)

1. **GitHub:** Repo → Settings → Pages → Build: GitHub Actions → Custom domain: `status.raastey.app` → Enforce HTTPS
2. **DNS:** Add a `CNAME` record: `status` → `raastey.github.io` (see [GitHub Pages custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site))
3. Wait for DNS + certificate provisioning (up to ~24h)

`CNAME` in repo root and `public/CNAME` both contain `status.raastey.app`.

## Deploy

Push to `main`. Workflow `.github/workflows/deploy.yml` builds with Astro and publishes to GitHub Pages.

## Non-goals (v1)

- Automated uptime probes ([RAA-97](https://linear.app/factoura/issue/RAA-97))
- Email / RSS subscriptions
