# OathAI Uncertain Future Archive

Public-source archive for `The Uncertain Future / 测不准的未来`.

This repository is intended to hold the essay-layer source of truth:

- essay metadata
- bilingual source markdown
- essay images
- publication links
- site-route manifest derived from the live OathAI site repo

It is designed to work with the current split:

- `GitHub` = source-of-truth archive
- `oathai.io` = public reading surface

## Scope

Included:

- `content/uncertain-future/essays.json`
- `content/uncertain-future/sources/*`
- `pic/uncertain-future/*`
- generated archive manifests under `data/`

Not included:

- homepage cards
- generated site HTML outside essay artifacts
- nginx / VPS deploy state

## Layout

```text
content/uncertain-future/
  essays.json
  sources/

pic/uncertain-future/

data/
  summary.json
  uncertain-future-manifest.json

scripts/
  sync-from-site.mjs
```

## Sync

From this repo root:

```bash
node scripts/sync-from-site.mjs
```

Default source site repo:

```text
../Oathai/www
```

Override source path:

```bash
node scripts/sync-from-site.mjs /absolute/path/to/Oathai/www
```

## Publication Status

Manifest rows include a derived `publicationStatus`:

- `external-published`
- `oathai-first`

Current summary counts and counterpart gaps are written to:

- `data/summary.json`

## Notes

- English sync remains the default rule.
- Some historical entries are still `zh`-only. Those are tracked in `data/summary.json` rather than silently normalized.
- This repo is archive-first. It does not replace `oathai.io` route, canonical, hreflang, or homepage presentation logic.
