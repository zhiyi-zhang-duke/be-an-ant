# be-an-ant

A personal AI-powered career development system with a single objective: get a job at Anthropic.

The name comes from the idea that ants don't overestimate the distance between where they are and where they need to go — they just move, methodically, one step at a time.

---

## What This Is

`be-an-ant` is a CLI tool that uses Claude as a structured career coach. It runs intake interviews, builds a prioritized action plan across every relevant dimension of career growth, and holds weekly retrospectives to track progress and recalibrate.

It is not motivational. It is operational.

---

## How It Works

There are four modes:

| Command | Description |
|---|---|
| `intake` | One-time structured interview to build your baseline profile |
| `plan` | Generates or updates a ranked action plan based on your profile |
| `retro` | Weekly retrospective — reviews progress, adjusts priorities |
| `log` | View session history and progress over time |

### Workflow

```
intake → plan → [weekly retro → recalibrate plan] → repeat
```

---

## Intake Interview

Before generating a plan, the tool interviews you across four areas:

1. **Current role** — What you do day-to-day, what your responsibilities are, what you are learning or not learning
2. **Target role at Anthropic** — What kind of role you are aiming for, what you know about the team or function
3. **Existing skills** — What you are strong in, what you can demonstrate, what is genuinely differentiated about you
4. **Starting constraints** — Time available per week, budget for courses or tools, credentials or degrees you currently hold or lack

Claude uses this to build a profile that persists across sessions.

---

## Action Plan

The plan is a ranked, living document. Claude scores and prioritizes across these dimensions:

1. **Current job performance** — Are you doing work that strengthens your candidacy? What specifically should change?
2. **Interview readiness** — Technical skills, system design, behavioral responses. What needs work and how to assess it.
3. **Personal projects** — Specifically [Openclaw](https://github.com/zhiyi-zhang-duke/openclaw), an open-source project that enables AI agents to control a VM. How to develop it, document it, and surface it to the right people.
4. **Online visibility** — LinkedIn, GitHub, Medium, blogs. Where you are findable, what story your profile tells.
5. **Network and access** — Who you already know or have access to that may be relevant. How to use those connections without wasting them.
6. **Credentials** — Certifications, courses, or degrees worth pursuing given your specific gap areas.
7. **Budget allocation** — How to distribute available spend across the above for maximum impact.

Priorities are not fixed. They shift based on what you report each week.

---

## Weekly Retrospective

Every week, `retro` mode asks:

- What did you actually do from the plan?
- What got in the way?
- What changed in your situation (role, budget, access, timeline)?

Claude uses that to score progress, update the plan, and surface what to focus on next week.

Session summaries are written to `sessions/` so there is a running record of where you started and where you are.

---

## Initial Setup

Before your first session, collect the following. You will be asked about all of it during intake:

- Your current job title and a plain-language description of what you do
- The Anthropic role(s) you are targeting (be specific if possible)
- A list of skills you are confident in and skills you suspect are gaps
- Your weekly hours available for this effort
- Your monthly budget (can be zero)
- Your current credentials (degrees, certifications)
- Your GitHub, LinkedIn, and any writing you have published

---

## Progress Tracking

Sessions are stored locally in `sessions/YYYY-MM-DD.md`. Each file contains:

- The mode run (`intake`, `plan`, `retro`)
- Key outputs (updated plan, scores, action items)
- A brief summary of what changed from the previous session

---

## Why This Exists

Getting a job at a specific company is not a vague goal. It is a project. This tool treats it like one.
