# Progress Over Time — Brainstorm

Features for tracking improvement across retro cycles. Everything here depends on the data model having historical plan snapshots, not just the current plan.

---

## Prerequisite: Plan Snapshots

**What:** At each retro, before overwriting `plan/current`, write the old plan to a `plan-history` subcollection with the date.

**Why it matters:** Without this, every retro throws away the previous state. The sessions collection only stores text summaries — there's no queryable history of how scores and ranks moved. Every feature below depends on this being in place first.

**Effort:** Minimal — one change to `retro.ts` and one new `db.ts` function.

---

## Features

### 1. Dimension Score Trends

Track each dimension's score (1–5) across retros and display movement as a terminal sparkline.

```
interviews  ▂▃▃▄▅  2 → 3 over 5 weeks
projects    ▅▄▄▃▃  3 → 2 (regressing)
visibility  ▂▂▂▂▃  flat, slight uptick
```

Regression flags are as valuable as improvement flags. A score that's been flat for 4 weeks is also worth surfacing.

---

### 2. Rank Stability / Churn

Track how often each dimension's rank changes across retros.

- If a dimension has been rank 1 for 6 weeks unchanged, either you're ignoring it or the model is stuck in a rut
- If dimensions are reshuffling every week, you may be thrashing priorities

Display as a count: "network has been rank 1 for 6 retros" or "interviews rank has changed 4 times in 5 weeks."

---

### 3. Action Completion Rate (Lightweight)

During retro, the LLM already asks what you did. Have it emit a `<completed>` block alongside `<plan>` and `<changes>` — a list of action texts that got done this week. Store completion counts per dimension on the session record.

This doesn't require action IDs or any new UX — it's a prompt change and a schema addition to `SessionSchema`.

A heavier version: give actions IDs and let users mark them done between retros with `ant done <action-id>`. More precise, more friction.

---

### 4. Readiness Score

A single number (1–100) derived from a weighted average of dimension scores, where the weights come from dimension ranks (rank 1 = highest weight). Updated each retro. Shown in `ant log`.

```
Week 1   ██████░░░░░░░░  42
Week 2   ███████░░░░░░░  48
Week 3   ████████░░░░░░  54
```

The math is simple. The open question is whether this single number is motivating or reductive.

---

### 5. Cadence Health

Show "last retro: N days ago" whenever any command runs. If the gap exceeds 10 days, surface the warning more prominently. Retros only compound if they're actually weekly.

Trivially easy to implement from the existing sessions collection.

---

### 6. `ant history [dimension]`

A focused view of one dimension across all retro snapshots: score, rank, rationale, and key actions at each point in time.

```
ant history interviews
```

Useful for understanding why something changed or spotting recurring patterns (e.g. interviews score dips every 3 weeks because practice sessions aren't happening).

---

## Priority Order

| Priority | Feature | Rationale |
|---|---|---|
| 1 | Plan snapshots | Foundation — nothing else works without it |
| 2 | Cadence health | Highest ROI per line of code |
| 3 | Dimension score trends | Most visually satisfying, directly answers "am I improving?" |
| 4 | Action completion rate (lightweight) | Adds real signal to sessions with minimal new infrastructure |
| 5 | Readiness score | Motivating but somewhat arbitrary |
| 6 | Rank stability / churn | Subtle insight, lower urgency |
| 7 | `ant history [dimension]` | Most powerful, but builds on all the above |
