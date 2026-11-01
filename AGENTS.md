# Amouzegar project workflow

For every change, follow [اسکیل/SKILL.md](اسکیل/SKILL.md). After a context reset or compaction, read that skill and `اسکیل/CONTEXT.md`, then the latest entries in `اسکیل/CHANGES.md`. Query the graph for the current task instead of rereading the entire project. Record each completed change and its verification in `اسکیل/CHANGES.md`; keep `اسکیل/CONTEXT.md` current for handoff.

Graphify is project-local: wherever the instructions below or the official skill say `graphify`, run `scripts/graphify.cmd` from the repository root instead. For example: `scripts/graphify.cmd query "App" --budget 1500`. If missing, run `npm run graph:setup`; initial graph generation is `npm run graph:build` (local code-only AST, no API). After code changes use `npm run graph:update`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
