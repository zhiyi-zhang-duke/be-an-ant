# Dimension: Budget

Money is a constraint, not a strategy. This dimension tracks how to allocate whatever you have available so that every dollar is doing something — and nothing is being spent out of anxiety.

---

## What This Covers

- Your monthly budget available for this effort
- What spending categories make sense given your current plan priorities
- Which tools, courses, or services are worth paying for
- Whether any spending is redundant or low value

---

## How the AI Evaluates It

During intake, you name a monthly budget (which can be zero). The model does not try to maximize spend — it tries to match spend to your highest-priority gaps.

Categories it may recommend spending on:

| Category | Examples |
|---|---|
| API costs | Claude, OpenAI, Gemini access for practice and building |
| Courses | Specific courses tied to identified skill gaps |
| Interview prep platforms | Paid mock interview services, if reps are the bottleneck |
| Visibility tools | Domain hosting, portfolio site, writing platforms |
| Community access | Conferences, paid communities with relevant members |

It will flag if you are spending on something that is not aligned with your current top priorities.

---

## What Improvement Looks Like

- Every line of spend is tied to a dimension that is currently active in the plan
- You are not spending on comfort (buying courses you don't finish, tools you don't use)
- API costs are not a blocker — you have enough headroom to build and iterate

The smallest meaningful budget is whatever keeps your API access open. Everything else is optional.

---

## How Retros Track It

Each week you report:

- Whether your budget has changed
- Whether any spend happened and whether it was useful
- Whether there is something you need to spend on that you have been avoiding

Budget is the lowest-volatility dimension. It rarely changes week to week, but the model will prompt you if your priorities have shifted and your spending has not kept up.

---

## CLI Command: `ant spend`

Tracks what you are spending and whether it is aligned with what is currently highest priority in your plan. Catches the most common failure mode: spending on low-priority dimensions while high-priority ones go unfunded.

```
ant spend log --category course --amount 49 --note "FastAI part 2"
ant spend log --category api --amount 20 --note "Anthropic API credits"
ant spend report
ant spend report --month 2025-03
```

**Categories:** `api`, `course`, `tools`, `community`, `other`

**`log`:** Records a purchase with category, amount, and an optional note. Takes under 10 seconds.

**`report`:** Shows month-to-date spend by category alongside the current priority ranking from your plan. Flags misalignment — if interviews are your top priority and you have spent nothing on practice but $80 on courses for a lower-priority credential gap, it surfaces that explicitly.

Spend data is stored locally in `~/.be-an-ant/spend.json`. The retro command references it automatically.
