# Graph Report - Amouzegar  (2026-11-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 166 nodes · 294 edges · 18 communities (10 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- App.tsx
- toPersianDigits
- react
- compilerOptions
- dependencies
- devDependencies
- scripts
- راهنمای کار روی پروژه آموزگار
- vite.config.ts
- package.json
- main.tsx
- Run and deploy your AI Studio app
- تاریخچهٔ تغییرات
- tsx@^4.21.0
- @types/node@^22.14.0
- typescript@^7.0.2
- CONTEXT.md

## God Nodes (most connected - your core abstractions)
1. `JewelryItem` - 19 edges
2. `react` - 19 edges
3. `lucide-react` - 16 edges
4. `compilerOptions` - 16 edges
5. `App()` - 15 edges
6. `toPersianDigits()` - 13 edges
7. `scripts` - 11 edges
8. `AdminPanel()` - 5 edges
9. `CollectionSection()` - 4 edges
10. `HeroVideoPiecesDetail()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `AdminPanelProps` --references--> `JewelryItem`  [EXTRACTED]
  src/components/AdminPanel.tsx → src/types.ts
- `ProductModalProps` --references--> `JewelryItem`  [EXTRACTED]
  src/components/ProductModal.tsx → src/types.ts
- `WishlistDrawerProps` --references--> `JewelryItem`  [EXTRACTED]
  src/components/WishlistDrawer.tsx → src/types.ts
- `CollectionSectionProps` --references--> `JewelryItem`  [EXTRACTED]
  src/components/CollectionSection.tsx → src/types.ts
- `HeroSectionProps` --references--> `JewelryItem`  [EXTRACTED]
  src/components/HeroSection.tsx → src/types.ts

## Import Cycles
- None detected.

## Communities (18 total, 8 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.12
Nodes (26): App(), BrandSloganSection(), BrandSloganSectionProps, CollectionSection(), CollectionSectionProps, Footer(), HeroSection(), HeroSectionProps (+18 more)

### Community 1 - "toPersianDigits"
Cohesion: 0.14
Nodes (14): AboutBrand(), AboutBrandProps, STORE_GALLERY_IMAGES, JEWELRY_SECTIONS, JewelryMenuSection, Navbar(), NavbarProps, SubmenuLink (+6 more)

### Community 2 - "react"
Cohesion: 0.15
Nodes (12): lucide-react, react, AdminPanel(), AdminPanelProps, AVAILABLE_STONES_AND_CUTS, CATEGORY_OPTIONS, CERTIFICATE_ISSUERS, FOOTER_LOCATION (+4 more)

### Community 3 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 4 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, dotenv@^17.2.3, express@^4.21.2, @google/genai@^2.4.0, lucide-react@^0.546.0, motion@^12.23.24, react@^19.0.1, dotenv (+3 more)

### Community 5 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, autoprefixer@^10.4.21, esbuild@^0.25.0, @types/express@^4.17.21, @types/react@^19.3.0, @types/react-dom@^19.3.0, autoprefixer, esbuild (+3 more)

### Community 6 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, clean, dev, graph:build, graph:explain, graph:query, graph:setup (+3 more)

### Community 7 - "راهنمای کار روی پروژه آموزگار"
Cohesion: 0.25
Nodes (6): Amouzegar project workflow, graphify, ابزار و محدوده, انجام تغییرات, راهنمای کار روی پروژه آموزگار, شروع یا بازیابی کانتکست

### Community 8 - "vite.config.ts"
Cohesion: 0.25
Nodes (6): @tailwindcss/vite@^4.3.3, vite@^8.3.0, @vitejs/plugin-react@^6.1.1, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 9 - "package.json"
Cohesion: 0.29
Nodes (6): tailwindcss@^4.3.3, name, private, type, version, tailwindcss

## Knowledge Gaps
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.tsx`, `toPersianDigits`, `dependencies`, `package.json`, `main.tsx`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12222222222222222 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `App.tsx`, `package.json`, `dependencies`, `toPersianDigits`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Should `toPersianDigits` be split into smaller, more focused modules?**
  _Cohesion score 0.14210526315789473 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._