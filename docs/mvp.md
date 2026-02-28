# MVP

The goal of the MVP is a working CLI that a user can install, authenticate, and run the core loop with: intake → plan → retro. Everything else is post-MVP.

---

## Definition of Done

The MVP is done when:

1. `npx be-an-ant intake` runs a structured interview and saves a profile to Firestore
2. `npx be-an-ant plan` reads that profile and writes a ranked, actionable plan
3. `npx be-an-ant retro` reviews the past week and updates the plan in place
4. `npx be-an-ant log` prints a session history

A user with an API key and a Firebase project config can go from zero to a working plan in one sitting.

---

## In Scope

### Core infrastructure
- `package.json` + `tsconfig.json` — buildable, publishable package with `bin` pointing to the CLI entry
- `src/firebase.ts` — Firestore client, anonymous auth, `uid()` helper
- `src/schema.ts` — Zod schemas for `Profile`, `Plan`, `Session`; other schemas stubbed but not required to work
- `src/db.ts` — `getProfile`, `saveProfile`, `getPlan`, `savePlan`, `addSession`, `getSessions`
- `src/llm.ts` — single `llm(system, user)` function, Anthropic only; provider switching is post-MVP
- `src/config.ts` — reads/writes `~/.be-an-ant/config.json`; stores API key and Firebase config
- `src/index.ts` — Commander.js setup, registers the four core commands

### Core commands
- `ant intake` — multi-turn conversation across the four intake areas (current role, target role, skills, constraints); saves `Profile` to Firestore; records a `Session`
- `ant plan` — reads profile, calls LLM, validates output against `PlanSchema`, writes `Plan` to Firestore; records a `Session`
- `ant retro` — reads profile + current plan, runs the retrospective conversation, updates `Plan` in Firestore; records a `Session`
- `ant log` — reads `sessions` collection, prints a reverse-chronological summary

### First-run experience
- If no config exists, `ant intake` prompts for API key and Firebase config before starting the interview
- Clear error messages if Firestore write fails or LLM returns unparseable output

---

## Out of Scope (Post-MVP)

These are intentionally deferred. None of them block the core loop.

| Feature | Reason deferred |
|---|---|
| OpenAI / Google provider support | Extra config surface; Claude is the right default |
| `ant gap` | Useful but not needed to run the loop |
| `ant drill` | Stand-alone utility, no plan dependency |
| `ant velocity` | Requires git integration work |
| `ant audit` | Requires GitHub API integration |
| `ant contact` | Nice-to-have; no loop dependency |
| `ant worth-it` | Stand-alone advisory command |
| `ant spend` | Budget tracking is low-stakes for early use |
| Upgrading from anonymous auth to email/Google | Anonymous auth is sufficient to start |
| `ant log` filtering / formatting flags | Plain output is enough for MVP |

---

## Build Sequence

Order matters — each step is a stable, testable checkpoint.

### 1. Project scaffold
- `package.json` with `commander`, `zod`, `@anthropic-ai/sdk`, `firebase-admin` dependencies
- `tsconfig.json` targeting Node 18+, `outDir: dist`, `strict: true`
- `src/index.ts` with a single `ant hello` command that prints `be-an-ant v0.1.0`
- Confirm `npx ts-node src/index.ts hello` works

### 2. Config
- `src/config.ts` — `getConfig()` and `saveConfig()` reading from `~/.be-an-ant/config.json`
- Config shape: `{ apiKey, firebase: { projectId, ... } }`
- `ant config` command that prompts for and saves the config (used by first-run)

### 3. Firebase + data layer
- `src/firebase.ts` — initialize Firestore and Auth from config; export `db` and `uid()`
- `src/schema.ts` — `ProfileSchema`, `PlanSchema`, `SessionSchema` only
- `src/db.ts` — the six functions listed in scope above
- Manual test: write a dummy profile, read it back, confirm Zod parse succeeds

### 4. LLM adapter
- `src/llm.ts` — `llm(system: string, user: string): Promise<string>` wrapping `@anthropic-ai/sdk`
- Reads `apiKey` from config, defaults to `claude-opus-4-6` (latest capable model)
- No streaming for MVP — full response, then parse

### 5. `ant intake`
- Prompt strategy: tool identity + dimension docs for current-role and baseline profile
- Multi-turn conversation until all four areas are covered
- Final turn asks the LLM to emit a `Profile` JSON object; validate with `ProfileSchema.parse`
- Save with `saveProfile`, record with `addSession`

### 6. `ant plan`
- Load profile, build system prompt from tool identity + all seven dimension docs
- Single LLM call returning a `Plan` JSON object; validate with `PlanSchema.parse`
- Save with `savePlan`, record with `addSession`
- Print the ranked plan to stdout on success

### 7. `ant retro`
- Load profile + current plan
- Multi-turn conversation: what did you do, what got in the way, what changed
- LLM emits an updated `Plan`; validate, overwrite with `savePlan`, record with `addSession`
- Print a diff of what changed (rank or score shifts)

### 8. `ant log`
- `getSessions()`, print in reverse-chron order: date, type, summary
- No flags needed for MVP

---

## Key Risks

**LLM output reliability** — The plan and profile commands depend on the LLM returning valid JSON in the exact schema shape. This needs a tight prompt and clear error messages when it fails. If `PlanSchema.parse` throws, print the Zod error with enough context to debug the prompt.

**Firebase cold-start** — First-run requires Firebase project config from the user. This is a real friction point. The config prompt in `ant intake` should be as minimal as possible — just `projectId` and the web API key, not the full service account JSON.

**Anonymous auth persistence** — Firebase anonymous auth tokens expire. The client SDK handles refresh automatically, but if the user clears their npm cache or runs from a new environment, they get a new UID and lose their data. Document this clearly. Upgrading to email auth is post-MVP but the path should be obvious.
