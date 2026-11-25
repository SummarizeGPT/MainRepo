# SummarizeGPT

A React/Vite article summarizer. This migration branch is **demo-only**: choose
**Use example URL** and submit to see a checked-in example summary. Other URLs
are not sent anywhere. No credentials or billable upstream services are used.

## Local development

Use Node.js 24.x.

```sh
npm ci
npm run lint
npm run build
npm run preview
```

## Cloudflare staging

This repository targets the separate `muneeb-sgpt-team` Worker. Vite's existing
`dist/` output deploys as Workers Static Assets; no framework adapter or Worker
runtime code is required. With Node 24.22.0 or later in the 24.x line and
Cloudflare CLI authentication scoped to the personal account:

```sh
npm run build
npx --yes cf@1.0.0-rc.5 previews deploy ./dist --preview-name stage
```

To connect [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/),
install/authorize the **Cloudflare Workers and Pages** GitHub App on the
`SummarizeGPT` organization with **Only select repositories → MainRepo**.
In `muneeb-sgpt-team` → **Settings → Builds**, connect
`SummarizeGPT/MainRepo` at the repository root with:

| Setting | Value |
| --- | --- |
| Build command | `npm run lint && npm run build` |
| Deploy command | `npx --yes cf@1.0.0-rc.5 deploy ./dist --no-provision` |
| Preview command | `npx --yes cf@1.0.0-rc.5 previews deploy ./dist` |
| Production branch | `main` |
| Non-production branch builds | Enabled |

Keep the first production build disabled or deferred until this configuration
is on `main` and the owner approves production. Validate a branch Preview and
its GitHub check before enabling production builds. Do not copy Vercel build
variables; this project has none.

## Before production

- Treat the old browser-facing RapidAPI credential as exposed. The owner should
  revoke/rotate it at RapidAPI, remove the old variable from Vercel, and review
  provider usage. Never set a replacement in Vite or the build environment.
- If live summarization is needed, use a production-only Worker secret and a
  same-origin endpoint behind an owner-only Access allow policy. Validate the
  Access JWT in the handler and keep other entrypoints and previews keyless.
  Use a fixed upstream, validate submitted URLs, and enforce provider quotas and
  application-level rate limits. Verify anonymous/bypass requests cannot reach
  upstream before adding a key. This is not implemented in the demo.
- Vercel currently serves `main-repo-six.vercel.app`; that managed hostname
  cannot transfer. The old `www.summarizegpt.muneebfarrukh.com` alias no longer
  resolves. After approval, choose an owned hostname, deploy and test the Worker,
  and attach the hostname as a Workers Custom Domain. Keep Vercel intact for
  rollback, and coordinate any merge while Vercel still auto-builds `main`:
  merging this branch would replace live summarization there with the demo.
  If a later hostname switch fails, restore its previous mapping (or remove the
  new mapping if none existed) and direct users to the existing Vercel URL.
