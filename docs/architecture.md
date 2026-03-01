# Architecture

This document captures the technical decisions for `be-an-ant` — stack, storage, data model, and how the pieces fit together.

---

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Type safety across LLM response parsing, strong ecosystem for CLI tooling, ships as an npm package |
| Runtime | Node.js | Cross-platform, good Firebase and LLM SDK support, installable via `npx` without a separate install step |
| CLI framework | Commander.js | Lightweight, handles subcommands cleanly (`ant contact add`, `ant spend log`), wide adoption |
| Storage | Firebase Firestore | Cloud-synced — works on any device without manual file management. See Storage section below. |
| Auth | Firebase Auth | Anonymous auth by default, upgradable to email/Google. User identity ties all data together across devices. |

---

## LLM Providers

Configured via environment variable or `~/.be-an-ant/config.json`. Defaults to Claude.

| Provider | SDK | Env var |
|---|---|---|
| Anthropic (default) | `@anthropic-ai/sdk` | `ANTHROPIC_API_KEY` |
| OpenAI | `openai` | `OPENAI_API_KEY` |
| Google | `@google/generative-ai` | `GOOGLE_API_KEY` |

All LLM calls go through a single internal `llm.ts` adapter that normalizes the interface. Swapping providers does not require changes to any command logic.

---

## Storage

All persistent data lives in **Firebase Firestore**. There is no local session directory — the previous `sessions/YYYY-MM-DD.md` model is replaced by Firestore documents.

**Why Firestore:**
- Cross-device sync with zero configuration
- Works from any client (CLI, web, future mobile) against the same data
- Real-time capable — future dashboard or web UI can read the same data live
- Firebase anonymous auth means no account required to start; opt-in to sign-in later

**Local config** (`~/.be-an-ant/config.json`) stores only:
- API keys (never written to Firestore)
- Firebase project config
- Preferred LLM provider and model

---

## Firestore Data Model

All collections are scoped to a user ID (`/users/{uid}/...`).

| Collection | Type | Written by |
|---|---|---|
| `profile` | Single document | `ant intake` |
| `plan` | Single document | `ant plan`, `ant retro` |
| `sessions` | Collection | `ant intake`, `ant plan`, `ant retro` |
| `drills` | Collection | `ant drill` |
| `contacts` | Collection | `ant contact add` |
| `spend` | Collection | `ant spend log` |
| `projects` | Collection | `ant velocity --add` |

Velocity data is computed live from the local git log at runtime — it is never written to Firestore.

The data layer uses **Zod schemas as the single source of truth** — schemas define document shapes, TypeScript types are derived from them, and all Firestore reads and LLM output are validated at runtime before being written.

Full implementation plan, schema definitions, and `db.ts` patterns: [`docs/data-layer.md`](data-layer.md)

---

## Project Structure

```
be-an-ant/
├── src/
│   ├── index.ts          # CLI entry point, command registration
│   ├── llm.ts            # LLM provider adapter
│   ├── firebase.ts       # Firestore client, auth initialization
│   ├── config.ts         # Local config read/write (~/.be-an-ant/config.json)
│   └── commands/
│       ├── intake.ts
│       ├── plan.ts
│       ├── retro.ts
│       ├── log.ts
│       ├── gap.ts
│       ├── drill.ts
│       ├── velocity.ts
│       ├── audit.ts
│       ├── contact.ts
│       ├── worth-it.ts
│       └── spend.ts
├── docs/
│   ├── architecture.md   # this file
│   └── dimensions/
│       ├── current-role.md
│       ├── interviews.md
│       ├── projects.md
│       ├── visibility.md
│       ├── network.md
│       ├── credentials.md
│       └── budget.md
├── package.json
├── tsconfig.json
└── README.md
```

---

## System Prompt Strategy

Each command builds a system prompt from three layers:

1. **Tool identity** — what `be-an-ant` is, what it is trying to do, what tone it uses (operational, not motivational)
2. **User profile** — the full `profile` document from Firestore, injected as context
3. **Dimension doc** — the relevant `docs/dimensions/*.md` file for the current command

This means the dimension docs are not just documentation — they are live prompt context. Keeping them precise and specific directly improves output quality.
