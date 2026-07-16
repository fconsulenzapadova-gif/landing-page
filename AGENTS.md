# Agent Bootstrap

Start every non-trivial task from `docs/ai/MEMORY.md`. Treat that file as the project memory index: it points to the product brief, architecture notes, workflow runbooks, patterns, active context, progress, and decision records.

Keep this file portable across repositories. Do not add project names, absolute paths, product facts, command lists, issue notes, or architecture details here.

Update durable knowledge in the narrowest matching document:

- Product scope and user behavior: `docs/product/PRD.md`.
- Architecture, module boundaries, and data flow: `docs/architecture/`.
- Hard-to-reverse technical choices: `docs/architecture/decisions/`.
- Commands, validation, local setup, and external workflow steps: `docs/runbooks/`.
- Repeated implementation conventions: `docs/patterns/`.
- Current work state and handoff notes: `docs/ai/active-context.md` and `docs/ai/progress.md`.

Do not turn `AGENTS.md` into a task log.

If a local `caveman` skill is available, use it at `ultra` intensity for agent-facing planning, progress notes, investigation summaries, review handoffs, and final responses unless the user asks for normal mode. Keep code, commit messages, PR descriptions, and user-facing product copy normal.

Preserve existing user changes. Do not revert or overwrite unrelated dirty work. Never print secrets. Verify changes with the narrowest useful checks and report exact pass/fail results.
