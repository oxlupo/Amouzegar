<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Amouzegar | آموزگار

A jewelry storefront built with React, TypeScript, Vite, Tailwind CSS, and Motion.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d8680c6a-cdee-4790-bfb6-1842f702f6cc

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Project knowledge graph

The Graphify graph is stored in `graphify-out/graph.json`. Open
`graphify-out/graph.html` for the interactive view. Contributor instructions,
change history, and context handoff notes are in `اسکیل/` and `AGENTS.md`.

On Windows, with Python 3.10+ and [uv](https://docs.astral.sh/uv/getting-started/installation/):

```sh
npm run graph:setup
npm run graph:build
npm run graph:query -- "App"
npm run graph:update
```

`Images/`, `images/`, `.tools/`, local environment files, and Graphify caches
are ignored by Git.

## License

Source code is available under the [MIT License](LICENSE). Product imagery,
videos, logos, and brand names retain their respective owners' rights; the
code license does not grant trademark or third-party media rights.
