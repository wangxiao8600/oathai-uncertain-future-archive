import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJSON = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const essaysFile = "content/uncertain-future/essays.json";
const manifestFile = "data/uncertain-future-manifest.json";
const summaryFile = "data/summary.json";
const robotId = "in-the-name-of-robots-shut-up";

test("event indexes agree with essay metadata and manifest publication history", async () => {
  const base = "incident-records/2026-06-anthropic-public-voice-chain";
  const index = await readJSON(path.join(repo, base, "event-index.json"));
  const markdown = await fs.readFile(path.join(repo, base, "event-index.md"), "utf8");
  const essays = await readJSON(path.join(repo, essaysFile));
  const manifest = await readJSON(path.join(repo, manifestFile));
  for (const event of index.essay_line) {
    for (const [locale, route] of Object.entries(event.routes)) {
      const essay = essays.find((e) => e.pageId === event.pageId && e.locale === locale);
      const row = manifest.find((e) => e.pageId === event.pageId && e.locale === locale);
      assert.ok(essay && row, `${event.pageId}:${locale}`);
      assert.equal(event.date, essay.firstPublishedAt);
      assert.equal(event.date, row.firstPublishedAt);
      assert.equal(route, row.siteRoute);
      assert.ok(markdown.includes(`https://oathai.io${route})`));
      for (const url of event.external_links[locale] ?? []) {
        assert.ok(essay.externalLinks.some(([, link]) => link === url));
        assert.ok(row.externalLinks.some(([, link]) => link === url));
      }
      if (event.publication_status) {
        assert.equal(event.publication_status, row.publicationStatus);
        const section = markdown.split(/^\d+\. /m).find((block) => block.includes(`https://oathai.io${route})`));
        assert.ok(section.includes(`Publication status: \`${event.publication_status}\``));
      }
      if (event.pageId === robotId) {
        assert.equal(event.publication_status, "oathai-first");
        assert.match(essay.note, /First published on OathAI|先在\s*OathAI\s*首发/);
      }
    }
  }
});

async function fixture(run) {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), "archive-sync-"));
  const source = path.join(temp, "source");
  const target = path.join(temp, "target");
  try {
    for (const root of [source, target]) {
      await fs.mkdir(root, { recursive: true });
      for (const dir of ["content", "pic"]) {
        await fs.cp(path.join(repo, dir), path.join(root, dir), { recursive: true });
      }
    }
    const manifest = await readJSON(path.join(repo, manifestFile));
    // Pin the archived routes; this test does not import a newer site registry.
    const routes = Object.fromEntries(manifest.map((e) => [`${e.pageId}:${e.locale}`, e.siteRoute]));
    await fs.mkdir(path.join(source, "scripts"));
    await fs.writeFile(path.join(source, "scripts/page-registry.mjs"),
      `const routes = ${JSON.stringify(routes)};\nexport const pageById = id => ({id});\nexport const localizedRouteForPage = (page, locale) => routes[page.id + ':' + locale];\n`);
    const sync = () => spawnSync(process.execPath, [path.join(repo, "scripts/sync-from-site.mjs"), source], {
      cwd: target, encoding: "utf8"
    });
    await run({ source, target, manifest, sync });
  } finally {
    await fs.rm(temp, { recursive: true, force: true });
  }
}

async function assertIdenticalTree(a, b) {
  const names = await fs.readdir(a);
  assert.deepEqual((await fs.readdir(b)).sort(), [...names].sort());
  for (const name of names) {
    const left = path.join(a, name);
    const right = path.join(b, name);
    if ((await fs.stat(left)).isDirectory()) await assertIdenticalTree(left, right);
    else assert.deepEqual(await fs.readFile(right), await fs.readFile(left), name);
  }
}

test("archived sync preserves content and routes, corrects history, and omits local paths on repeat", async () => {
  await fixture(async ({ source, target, manifest, sync }) => {
    const essays = await readJSON(path.join(source, essaysFile));
    assert.equal(essays.length, 48);
    for (let attempt = 0; attempt < 2; attempt++) {
      const result = sync();
      assert.equal(result.status, 0, result.stderr);
      const actual = await readJSON(path.join(target, manifestFile));
      const expected = manifest.map((e) => ({ ...e,
        publicationStatus: e.pageId === robotId ? "oathai-first" : "external-published"
      }));
      assert.deepEqual(actual, expected);
      const summary = await readJSON(path.join(target, summaryFile));
      const baseline = await readJSON(path.join(repo, summaryFile));
      const { generatedAt, sourceRoot, ...stable } = baseline;
      assert.deepEqual(summary, { ...stable, generatedAt: summary.generatedAt, oathaiFirstEntries: 2 });
      assert.equal(summary.withExternalLinks, 48);
      assert.equal(Object.hasOwn(summary, "sourceRoot"), false);
      for (const file of [manifestFile, summaryFile]) {
        const text = await fs.readFile(path.join(target, file), "utf8");
        assert.equal(text.includes(source), false);
        assert.equal(/\/mnt\/[a-z]\/|\/home\/|\/Users\/|[A-Za-z]:[\\/](?!\/)/.test(text), false);
      }
      for (const dir of ["content", "pic"]) {
        await assertIdenticalTree(path.join(source, dir), path.join(target, dir));
      }
    }
  });
});

test("explicit first-publication facts hold when external links are absent", async () => {
  await fixture(async ({ source, target, sync }) => {
    const essays = await readJSON(path.join(source, essaysFile));
    for (const e of essays) e.externalLinks = [];
    await fs.writeFile(path.join(source, essaysFile), JSON.stringify(essays));
    const result = sync();
    assert.equal(result.status, 0, result.stderr);
    const manifest = await readJSON(path.join(target, manifestFile));
    assert.equal(manifest.filter((e) => e.publicationStatus === "oathai-first").length, 2);
    assert.equal(manifest.filter((e) => e.publicationStatus === "external-published").length, 46);
    assert.equal((await readJSON(path.join(target, summaryFile))).withExternalLinks, 0);
  });
});

for (const condition of ["missing", "conflicting"]) {
  test(`${condition} publication facts stop before modifying the existing archive`, async () => {
    await fixture(async ({ source, target, sync }) => {
      const essays = await readJSON(path.join(source, essaysFile));
      const rows = essays.filter((e) => e.pageId === robotId);
      for (const e of rows) e.note = "Author archive copy.";
      if (condition === "conflicting") {
        rows[0].note = "First published on OathAI on 2026-06-12.";
        rows[1].note = "2026-06-12 首次公开发布于外部平台。";
      }
      await fs.writeFile(path.join(source, essaysFile), JSON.stringify(essays));
      await fs.mkdir(path.join(target, "data"));
      for (const file of [manifestFile, summaryFile]) {
        await fs.copyFile(path.join(repo, file), path.join(target, file));
      }
      const result = sync();
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Missing or conflicting first-publication facts/);
      for (const dir of ["content", "pic", "data"]) {
        await assertIdenticalTree(path.join(repo, dir), path.join(target, dir));
      }
    });
  });
}
