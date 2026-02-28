# Dimension: Online Visibility

Before anyone at Anthropic talks to you, they will look you up. This dimension tracks what they find — and whether it helps or hurts.

---

## What This Covers

- GitHub: what your profile shows, what your pinned repos signal, commit frequency
- LinkedIn: whether your profile is coherent, current, and tells a story
- Writing: blog posts, Medium articles, technical writeups — anywhere you have published
- Search presence: what comes up when someone Googles your name
- Consistency: whether your professional identity is coherent across platforms

---

## How the AI Evaluates It

During intake, you provide links to your profiles and any published work. The model assesses:

1. **First impression** — what does a hiring manager see in the first 30 seconds?
2. **Signal gaps** — what would make your profile meaningfully stronger?
3. **Effort-to-impact ratio** — which platform gives you the most return on time spent?

For most engineers targeting Anthropic, GitHub is weighted highest. A strong GitHub presence with relevant projects is more credible than a polished LinkedIn.

---

## What Improvement Looks Like

- GitHub with pinned repos that show your best work, a readable profile README, and evidence of recent activity
- LinkedIn that is current, has a clear headline, and tells a coherent career story
- At least one piece of published writing that demonstrates technical depth or original thinking
- No embarrassing gaps — profiles that look abandoned signal low follow-through

---

## How Retros Track It

Each week you report:

- Whether you published anything
- Whether you updated any profiles
- Whether anything you shared got external engagement

Visibility work compounds slowly. The model will flag if you have gone multiple weeks without anything public-facing.

---

## CLI Command: `ant audit`

Pulls live data from public APIs to generate a scored visibility report card. No authentication required for public profiles — it reads what anyone else would see.

```
ant audit --github yourhandle
ant audit --github yourhandle --linkedin yourprofile
```

**GitHub audit checks:**
- Profile README exists and is non-trivial
- Pinned repos are current, relevant, and have real READMEs
- Commit activity over the past 90 days
- Star and fork counts on AI-adjacent repos
- Whether your most-viewed repos tell the right story

**Output:** A scored report card per platform (0–10) with a prioritized list of specific next actions ranked by estimated effort vs. visibility impact. Re-run anytime to track improvement.

LinkedIn audit is limited to profile completeness checks since LinkedIn's public data is restricted. It prompts you to self-report headline, summary, and recency rather than fetching live.
