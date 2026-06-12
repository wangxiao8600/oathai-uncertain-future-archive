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

function publicationStatus(entry) {
  return entry.externalLinks?.length ? "external-published" : "oathai-first";
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
        publicationStatus: publicationStatus(entry)
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
    sourceRoot,
    entries: essays.length,
    pageIds: byPage.size,
    locales: {
      en: essays.filter((entry) => entry.locale === "en").length,
      zh: essays.filter((entry) => entry.locale === "zh").length
    },
    withExternalLinks: essays.filter((entry) => entry.externalLinks?.length).length,
    oathaiFirstEntries: essays.filter((entry) => !entry.externalLinks?.length).length,
    imageAssets: (await fs.readdir(path.join(repoRoot, "pic", "uncertain-future"))).length,
    missingCounterparts
  };

  await fs.mkdir(path.join(repoRoot, "data"), { recursive: true });
  await fs.writeFile(path.join(repoRoot, "data", "uncertain-future-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  await fs.writeFile(path.join(repoRoot, "data", "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
}

for (const relativePath of copies) {
  await removeTarget(relativePath);
  await copyTarget(relativePath);
}

await buildDerivedData();

console.log(`Synced uncertain-future archive from ${sourceRoot}`);
