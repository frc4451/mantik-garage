# Mantik

Web-based programming and robotics learning platform for FIRST Robotics teams (Java, FTC, FRC, competitive coding).

Built with **Astro 5 + MDX + TypeScript**, deployed as a static site on GitHub Pages.

## Quick Start

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173/mantik-garage

The site is served from a base path (`/mantik-garage`) in dev as well as in
production, so local pages match the deployed URLs exactly. To develop at the
domain root instead, set `BASE_PATH=/`.

**Search in dev:** Pagefind indexes are created at build time. Run `npm run build` once (or use `npm run dev:search`), then restart `npm run dev` so `/pagefind/*` assets are available locally.

## Build & Preview

```bash
npm run build    # Astro build + Pagefind search index
npm run preview  # Preview production build locally
```

## Project Structure

```
src/
├── content/          # MDX lessons (java, ftc, frc, comp, homepage)
├── components/       # Layout + MDX block components
├── layouts/          # BaseLayout, LessonLayout
├── pages/            # Astro routes
└── styles/global.css # SWYFT design system

public/
└── media/            # Static assets

legacy/               # Pre-Astro JSON SPA (archived)
scripts/                # migrate-json-to-mdx.mjs
```

## Adding or Editing Content

Lesson files live in `src/content/{section}/`. Each file has frontmatter and a readable MDX body — **no component imports needed**.

See **[docs/content-authoring.md](docs/content-authoring.md)** for the full guide.

```mdx
---
title: Branching and Merging
lessonId: branching-merging
section: java
group: version-control
groupLabel: "Version Control with Git & GitHub"
groupOrder: 5
order: 4
difficulty: intermediate
duration: 35 min
---

### Working with Branches

Plain markdown paragraphs and lists work as expected.

```java
git branch feature-name
git checkout -b new-branch
```

<RulesBox title="Tips">

- Use feature branches for isolated work
- Keep `main` competition-ready

</RulesBox>

<ExerciseBox title="Practice">

1. Create a branch
2. Merge it back to main

</ExerciseBox>
```

### MDX Block Components

Registered in `src/mdx-components.ts` — use directly in lesson MDX without imports. Prefer markdown + fenced code over legacy prop-only usage.

| Component | Purpose |
|-----------|---------|
| `RulesBox` | Highlighted rules, tips, good practices (markdown slot) |
| `StepsBox` | Numbered steps |
| `ExerciseBox` | Practice tasks with optional answers |
| `LinkGrid` | Navigation link cards |
| `CodeBlock` | Legacy single code wrapper; prefer fenced code |
| `CodeTabs` / `CodeTab` | Tabbed code (Talon FX / SPARK MAX, etc.); use fenced code inside `CodeTab` slots |
| `TextBlock` | Legacy HTML strings only when markdown is not enough |
| `ContentTable` | Data tables |
| `DataTypesGrid` | Data type comparison cards |
| `LogicalOperators` | Operator reference |

## Migrating from Legacy JSON

The original JSON content is archived in `legacy/data/`. To re-run migration:

```bash
npm run migrate
```

**Warning:** This regenerates all of `src/content/` from JSON and **overwrites hand-edited MDX**. Commit or back up first. See [docs/content-authoring.md](docs/content-authoring.md).

## Deployment

### GitHub Pages (default)

`.github/workflows/deploy-pages.yml` builds and publishes `dist/` on every push
to `main`, and can be run manually from the Actions tab.

One-time repository setup:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. Push to `main` (or run the *Deploy to GitHub Pages* workflow manually)
3. The site goes live at `https://<owner>.github.io/<repo>` —
   https://frc4451.github.io/mantik-garage for this fork

The workflow takes the origin and base path from `actions/configure-pages`, so a
rename of the repository or a custom domain needs no code change.

`npm run build` produces exactly what the workflow publishes; serve `dist/`
under a `/mantik-garage` path to check it locally.

### Deployment target

`astro.config.mjs` reads two environment variables, defaulting to this fork's
Pages URL:

| Variable | Default | Purpose |
|----------|---------|---------|
| `SITE_URL` | `https://frc4451.github.io` | Origin used for canonical URLs, Open Graph tags, sitemap, robots.txt |
| `BASE_PATH` | `/mantik-garage` | Subdirectory the site is served from; `/` for a domain root |

Internal links are authored site-root-relative (`/frc/subsystems`) and get the
base prefix at render time — via `withBase()` / `withBaseHtml()` in
[`src/lib/url.ts`](src/lib/url.ts) for components, and the
[`rehypeBasePath`](scripts/rehype-base-path.mjs) plugin for Markdown and MDX.
Keep authoring root-relative paths; do not hardcode the base.

### Static hosting

GitHub Pages serves files only — no serverless functions, no redirect rules. The
Netlify configuration, its submit-resource function, and the Decap CMS admin at
`/admin` were removed with the move to Pages:

- **Resources** at `/resources` is a read-only catalog. Add approved links by
  editing `src/data/resources.json` — see
  [docs/content-authoring.md](docs/content-authoring.md).
- **Content editing** is MDX in the repo; there is no visual editor.
- Sitemap is auto-generated by `@astrojs/sitemap`; search is
  [Pagefind](https://pagefind.app), built in `postbuild`.

## License

Copyright © 2026 Mantik
