# Dimension: Interview Readiness

Most people prepare for interviews in a way that is too shallow and too late. This dimension treats interview prep as a skill that compounds — built incrementally over weeks, not crammed the week before a screen.

---

## What This Covers

- Technical depth: algorithms, system design, and the specific domains Anthropic roles touch
- Behavioral responses: the stories you tell, how you frame them, what they reveal
- Communication: whether you think clearly under pressure and explain complex things well
- Anthropic-specific context: what they actually look for, how their process works, what matters to this company specifically
- Self-assessment: knowing where you are weak before someone else finds it

---

## How the AI Evaluates It

During intake, you describe your current interview experience and comfort level. The model identifies:

1. **Gaps by type** — technical, behavioral, or structural (you don't know how to run an interview)
2. **Gaps by domain** — what specific topics are likely to come up for your target role and what you don't have solid answers for
3. **Practice opportunities** — how to build reps without waiting for real interviews

This dimension often surfaces as the highest priority early on, because interview skill decays without practice and takes time to rebuild.

---

## What Improvement Looks Like

- Regular mock interviews — ideally with a human, acceptable with an AI
- Being able to tell three to five sharp, specific behavioral stories that each demonstrate different competencies
- Confidently designing a system from scratch under ambiguity
- Having genuine, researched answers to "why Anthropic" and "why this role"
- No surprises in your own resume — you can speak fluently to every line

---

## How Retros Track It

Each week you report:

- Whether you did any interview practice
- What format it was (mock, LeetCode, written, etc.)
- How it felt, what broke down, what improved

The model tracks your practice frequency and adjusts the plan if you're falling behind on reps. It will also suggest specific problem areas to drill based on your profile and target role.

---

## CLI Command: `ant drill`

Runs an interactive mock interview session in the terminal. You pick a type, respond to questions, and receive structured feedback. Each session is logged automatically so retros can show your rep count and surface weeks with no practice.

```
ant drill behavioral
ant drill system-design
ant drill technical
ant drill why-anthropic
```

**Behavioral:** Asks competency-based questions (leadership, conflict, ambiguity, failure) and evaluates your answer for specificity, structure, and what it reveals about you. Helps surface your best stories and identify which competencies you have weak coverage for.

**System design:** Poses an open-ended design problem, walks through it interactively, and evaluates your ability to handle ambiguity, drive toward decisions, and communicate tradeoffs.

**Technical:** Targeted questions based on your gap profile — what your intake identified as weak areas for your specific target role.

**Why Anthropic:** Evaluates your answer to the most important non-technical question. Flags if it sounds generic, rehearsed, or unconvincing.

Sessions are stored in `sessions/drills/` with date, type, duration, and model feedback.
