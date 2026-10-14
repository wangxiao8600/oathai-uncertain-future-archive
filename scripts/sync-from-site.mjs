import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const repoRoot = process.cwd();
const sourceRoot = path.resolve(process.argv[2] ?? path.join(repoRoot, "..", "Oathai", "www"));

const copies = [
  "content/uncertain-future/essays.json",
  "content/uncertain-future/en.html",
  "content/uncertain-future/zh.html",
  "content/uncertain-future/sources",
  "pic/uncertain-future"
];

async function removeTarget(relativePath) {
  await fs.rm(path.join(repoRoot, relativePath), { recursive: true, force: true });
}

async function copyTarget(relativePath) {
  const from = path.join(sourceRoot, relativePath);
  const to = path.join(repoRoot, relativePath);
  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.cp(from, to, { recursive: true, force: true });
}

function publicationStatus(entry, essays) {
  // Publication links may be later republications. Use the recorded history.
  const statuses = new Set();
  for (const record of essays.filter((record) => record.pageId === entry.pageId)) {
    const note = record.note ?? "";
    if (/First published on OathAI\b|先在\s*OathAI\s*首发/i.test(note)) {
      statuses.add("oathai-first");
    }
    if (/First published externally\b|Written and externally published\b|首次公开发布于外部平台/i.test(note)) {
      statuses.add("external-published");
    }
  }
  if (statuses.size !== 1) {
    throw new Error(`Missing or conflicting first-publication facts: ${entry.pageId}`);
  }
  return [...statuses][0];
}

async function buildDerivedData() {
  const essaysPath = path.join(repoRoot, "content", "uncertain-future", "essays.json");
  const essays = JSON.parse(await fs.readFile(essaysPath, "utf8"));
  const pageRegistryUrl = pathToFileURL(path.join(sourceRoot, "scripts", "page-registry.mjs")).href;
  const pageRegistry = await import(pageRegistryUrl);
  const { pageById, localizedRouteForPage } = pageRegistry;

  const manifest = essays
    .map((entry) => {
      const page = pageById(entry.pageId);
      return {
        pageId: entry.pageId,
        locale: entry.locale,
        title: entry.title,
        firstPublishedAt: entry.firstPublishedAt,
        timelineOrder: entry.timelineOrder,
        documentType: entry.documentType,
        siteRoute: localizedRouteForPage(page, entry.locale),
        sourcePath: `/${path.posix.join("content", "uncertain-future", entry.source.replace(/\\/g, "/"))}`,
        externalLinks: entry.externalLinks,
        keyTerms: entry.keyTerms,
        publicationStatus: publicationStatus(entry, essays)
      };
    })
    .sort((a, b) => {
      if (a.timelineOrder !== b.timelineOrder) return a.timelineOrder - b.timelineOrder;
      if (a.pageId !== b.pageId) return a.pageId.localeCompare(b.pageId);
      return a.locale.localeCompare(b.locale);
    });

  const byPage = new Map();
  for (const entry of essays) {
    const locales = byPage.get(entry.pageId) ?? [];
    locales.push(entry.locale);
    byPage.set(entry.pageId, locales);
  }

  const missingCounterparts = [...byPage.entries()]
    .filter(([, locales]) => !(locales.includes("en") && locales.includes("zh")))
    .map(([pageId, locales]) => ({
      pageId,
      locales: [...new Set(locales)].sort()
    }));

  const summary = {
    generatedAt: new Date().toISOString(),
    entries: essays.length,
    pageIds: byPage.size,
    locales: {
      en: essays.filter((entry) => entry.locale === "en").length,
      zh: essays.filter((entry) => entry.locale === "zh").length
    },
    withExternalLinks: essays.filter((entry) => entry.externalLinks?.length).length,
    oathaiFirstEntries: manifest.filter((entry) => entry.publicationStatus === "oathai-first").length,
    imageAssets: (await fs.readdir(path.join(repoRoot, "pic", "uncertain-future"))).length,
    missingCounterparts
  };

  await fs.mkdir(path.join(repoRoot, "data"), { recursive: true });
  await fs.writeFile(path.join(repoRoot, "data", "uncertain-future-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  await fs.writeFile(path.join(repoRoot, "data", "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
}

// Reject incomplete publication history before replacing archived content.
const sourceEssays = JSON.parse(await fs.readFile(path.join(sourceRoot, "content", "uncertain-future", "essays.json"), "utf8"));
for (const entry of sourceEssays) publicationStatus(entry, sourceEssays);

for (const relativePath of copies) {
  await removeTarget(relativePath);
  await copyTarget(relativePath);
}

await buildDerivedData();

console.log(`Synced uncertain-future archive from ${sourceRoot}`);
