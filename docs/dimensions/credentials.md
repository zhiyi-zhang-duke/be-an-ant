# Dimension: Credentials

Credentials are rarely the bottleneck, but they can be a blocker. This dimension tracks what you have, what you might need, and what is worth the investment vs. what is just resume decoration.

---

## What This Covers

- Formal degrees (CS, engineering, or adjacent)
- Professional certifications relevant to AI, cloud, or software engineering
- Courses or programs that fill specific skill gaps
- Certifications that signal domain credibility (e.g. AWS, GCP, ML-specific certs)
- What credentials Anthropic actually cares about (vs. what looks good on paper)

---

## How the AI Evaluates It

During intake, you list your current credentials and any you are considering. The model assesses:

1. **Gap vs. growth** — is a credential filling a real gap, or are you seeking it to feel like you are making progress?
2. **Signal value** — will this credential actually matter to an Anthropic hiring manager?
3. **Opportunity cost** — could the same time be better spent on a visible project?

For most senior engineers, a credential rarely moves the needle as much as a strong project or demonstrated skill. The model will be direct if a credential you are considering is low ROI.

---

## What Improvement Looks Like

- Completing a course that specifically addresses a weakness identified during intake
- A certification that is genuinely respected in ML or AI infrastructure (e.g. DeepLearning.AI specializations, cloud ML certs)
- Finishing something you already started

Pursuing a degree to compensate for lacking one is rarely the right path. If that is your situation, the plan will address it differently — through visible work, not years of school.

---

## How Retros Track It

Each week you report:

- Whether you completed any coursework or modules
- Whether you achieved or are close to a certification
- Whether the credential is still worth pursuing

Credentials are tracked loosely. They matter less week-to-week than projects or interview prep, and the model will deprioritize this dimension unless you are in active pursuit of something specific.

---

## CLI Command: `ant worth-it`

Evaluates a credential or course you are considering before you commit time or money to it. Fast — this is a 60-second check, not a full session.

```
ant worth-it "DeepLearning.AI ML specialization"
ant worth-it "AWS Solutions Architect cert"
ant worth-it "Fast.AI practical deep learning"
```

**Evaluation factors:**
- Does this fill a gap identified in your intake profile?
- Will an Anthropic hiring manager care about this, or is it neutral?
- What is the estimated time cost, and what else could you do with that time?
- Is there a faster or cheaper way to demonstrate the same skill?

**Output:** A verdict — pursue, deprioritize, or "only after X" — with a concise rationale. No hedging. If it's low ROI, it says so directly.

Run this before enrolling in anything. The most common pattern it catches: pursuing a credential to feel like you're making progress when a shipped project would do more.
