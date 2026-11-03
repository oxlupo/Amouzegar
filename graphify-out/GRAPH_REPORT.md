# Graph Report - Amouzegar  (2026-11-03)

## Corpus Check
- 36 files · ~37,819 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .css 3, .raw 1)

## Summary
- 233 nodes · 398 edges · 14 communities (11 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `333e8da1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- lucide-react
- toPersianDigits
- compilerOptions
- package.json
- JewelryCategoryPage.tsx
- scripts
- راهنمای کار روی پروژه آموزگار
- JewelryItem
- محصولات با پس‌زمینهٔ شفاف
- تصاویر بخش سفید صفحهٔ اول
- Amouzegar | آموزگار
- تاریخچهٔ تغییرات
- App.tsx

## God Nodes (most connected - your core abstractions)
1. `تاریخچهٔ تغییرات` - 30 edges
2. `react` - 21 edges
3. `JewelryItem` - 21 edges
4. `App()` - 20 edges
5. `lucide-react` - 17 edges
6. `compilerOptions` - 16 edges
7. `toPersianDigits()` - 13 edges
8. `scripts` - 11 edges
9. `HeroVideoPiecesDetail()` - 6 edges
10. `matchesCategory()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `2026-11-01 — راه‌اندازی Git و Graphify` --references--> `App()`  [INFERRED]
  اسکیل/CHANGES.md → src/App.tsx
- `وضعیت جاری` --references--> `JewelryNameIndex()`  [INFERRED]
  اسکیل/CONTEXT.md → src/components/JewelryNameIndex.tsx
- `AdminPanelProps` --references--> `JewelryItem`  [EXTRACTED]
  src/components/AdminPanel.tsx → src/types.ts
- `JewelryCategoryPageProps` --references--> `JewelryItem`  [EXTRACTED]
  src/components/JewelryCategoryPage.tsx → src/types.ts
- `ProductDetailPageProps` --references--> `JewelryItem`  [EXTRACTED]
  src/components/ProductDetailPage.tsx → src/types.ts

## Import Cycles
- None detected.

## Communities (14 total, 3 thin omitted)

### Community 1 - "lucide-react"
Cohesion: 0.24
Nodes (8): lucide-react, AdminPanel(), AdminPanelProps, AVAILABLE_STONES_AND_CUTS, CATEGORY_OPTIONS, CERTIFICATE_ISSUERS, ImageCropperModal(), ImageCropperModalProps

### Community 2 - "toPersianDigits"
Cohesion: 0.18
Nodes (11): AboutBrand(), AboutBrandProps, STORE_GALLERY_IMAGES, ProductDetailPage(), ProductDetailPageProps, ProductModal(), ProductModalProps, WishlistDrawer() (+3 more)

### Community 3 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 4 - "package.json"
Cohesion: 0.06
Nodes (44): dependencies, dotenv@^17.2.3, express@^4.21.2, @google/genai@^2.4.0, lucide-react@^0.546.0, motion@^12.23.24, react@^19.0.1, react-dom@^19.0.1 (+36 more)

### Community 5 - "JewelryCategoryPage.tsx"
Cohesion: 0.22
Nodes (14): CATEGORY_TABS, CategoryTab, GROUP_LABELS, JewelryCategoryPage(), JewelryCategoryPageProps, listHas(), matchesCategory(), metalHas() (+6 more)

### Community 6 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, clean, dev, graph:build, graph:explain, graph:query, graph:setup (+3 more)

### Community 7 - "راهنمای کار روی پروژه آموزگار"
Cohesion: 0.25
Nodes (6): Amouzegar project workflow, graphify, ابزار و محدوده, انجام تغییرات, راهنمای کار روی پروژه آموزگار, شروع یا بازیابی کانتکست

### Community 8 - "JewelryItem"
Cohesion: 0.13
Nodes (22): react, CollectionSection(), CollectionSectionProps, HeroSectionProps, easeInOutCubic(), HeroVideoPiecesDetail(), HeroVideoPiecesDetailProps, mapProgressToTime() (+14 more)

### Community 11 - "Amouzegar | آموزگار"
Cohesion: 0.40
Nodes (4): Amouzegar | آموزگار, License, Project knowledge graph, Run Locally

### Community 12 - "تاریخچهٔ تغییرات"
Cohesion: 0.07
Nodes (29): 2026-11-01 — آماده‌سازی اولین کامیت, 2026-11-01 — اصلاح رابط کاربری صفحهٔ شاپ (محصولات), 2026-11-01 — اصلاحات با تأیید صریح مالک, 2026-11-01 — انتخاب تصاویر فهرست آثار از آرشیو, 2026-11-01 — انتشار تصاویر شفاف, 2026-11-01 — انتشار عمومی در GitHub, 2026-11-01 — بخش سفید با تصاویر بدون پس‌زمینه, 2026-11-01 — بخش سفید: فقط آثار با نام کوتاه و پوشهٔ عکس اختصاصی (+21 more)

### Community 22 - "App.tsx"
Cohesion: 0.10
Nodes (24): App(), BespokeAtelier(), BespokeAtelierProps, toPersianDigits(), BrandSloganSection(), BrandSloganSectionProps, Footer(), FOOTER_LOCATION (+16 more)

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `JewelryItem` to `lucide-react`, `toPersianDigits`, `package.json`, `JewelryCategoryPage.tsx`, `App.tsx`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `App()` connect `App.tsx` to `lucide-react`, `toPersianDigits`, `package.json`, `JewelryCategoryPage.tsx`, `JewelryItem`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0563265306122449 - nodes in this community are weakly interconnected._
- **Why does `تاریخچهٔ تغییرات` connect `تاریخچهٔ تغییرات` to `App.tsx`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **Should `JewelryItem` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `تاریخچهٔ تغییرات` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._