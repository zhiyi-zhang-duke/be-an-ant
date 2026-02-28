# Dimension: Current Role

Your current job is either building your candidacy or quietly working against it. This dimension tracks whether your day-to-day work is closing the gap to Anthropic — or just filling time.

---

## What This Covers

- What you are actually doing at work vs. what Anthropic would care about
- Whether you have opportunities to work on AI-adjacent problems
- How visible your work is internally and externally
- Whether your manager or peers know you are aiming upward
- Scope and ownership — are you doing work that demonstrates senior-level judgment?

---

## How the AI Evaluates It

During intake, you describe your current role in plain language. The model maps that against the target role's likely expectations and identifies:

1. **Alignment gaps** — skills or problem types your current job doesn't exercise
2. **Hidden assets** — things you're doing that are more relevant than you realize
3. **Leverage opportunities** — ways to steer your current work toward more relevant ground without changing jobs

This isn't about quitting. It's about getting more out of where you already are.

---

## What Improvement Looks Like

- Taking on or volunteering for work that involves LLMs, developer tooling, or infrastructure
- Writing internal documents or postmortems that demonstrate the kind of systems thinking Anthropic values
- Positioning for a promotion, scope increase, or team transfer that gets you closer
- Having a clear, honest story about what you do that you could tell in an interview

---

## How Retros Track It

Each week you report:

- What you shipped or contributed
- Whether any of it was AI-adjacent or technically differentiated
- Whether anything changed in your role, team, or responsibilities

The model uses this to update its estimate of how much your current job is helping vs. how much you need to compensate with outside work.

---

## CLI Command: `ant gap`

Runs an on-demand comparison between your current role and your target role. Can also accept a raw job description to evaluate fit against any specific listing.

```
ant gap
ant gap --jd path/to/job-description.txt
ant gap --jd "paste raw job description text"
```

**Output:** Three ranked lists — alignment gaps (skills your job doesn't exercise), hidden assets (things you're doing that matter more than you realize), and leverage opportunities (specific actions to steer your current work toward more relevant ground). Scores each item by estimated impact on candidacy.

Run this anytime — not just during intake. Use it when a new Anthropic role posts, when your responsibilities shift, or when you want a fresh read on where you stand.
