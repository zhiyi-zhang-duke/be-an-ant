# be-an-ant

A personal AI-powered career development system with a single objective: get a job at Anthropic.

The name comes from the idea that ants don't overestimate the distance between where they are and where they need to go — they just move, methodically, one step at a time.

---

## What This Is

`be-an-ant` is a CLI tool that uses an AI model as a structured career coach. It runs intake interviews, builds a prioritized action plan across every relevant dimension of career growth, and holds weekly retrospectives to track progress and recalibrate.

It supports multiple LLM providers — Claude (Anthropic), GPT-4o (OpenAI), and Gemini (Google) — configurable at startup.

It is not motivational. It is operational.

---

## Baseline Profile

This is the starting context seeded into every session. The intake interview expands on this and fills in gaps.

**Current role:** Senior Software Engineer

**Target roles (primary):**
- Software Engineer, Claude Code
- Software Engineer, Agent SDK

**Target roles (also considering):**
- Member of Technical Staff
- Software Engineer, Claude Developer Platform
- Growth Engineer

**What draws me to Anthropic:**
- The AI work is genuinely novel — problems that haven't been solved before
- I want to work where the problems are still being defined, not just executed on
- The caliber of people. I want to be around engineers and researchers who are AI-native by default
- The safety mission aligns with how I think about AI and ethics
- Specifically interested in AI tools for AI development — building the infrastructure that accelerates AI work itself

---

## How It Works

### Core Commands

These run the main loop of the tool.

| Command | Description |
|---|---|
| `ant intake` | One-time structured interview to build your baseline profile |
| `ant plan` | Generates or updates a ranked action plan based on your profile |
| `ant retro` | Weekly retrospective — reviews progress, adjusts priorities |
| `ant log` | View session history and progress over time |

### Dimension Commands

Each command maps to one of the seven plan dimensions. Run these on demand — between retros, before decisions, or whenever you want a sharper read on a specific area.

| Command | Dimension | What It Does |
|---|---|---|
| `ant gap` | Current Role | Compares your role against your target role — gaps, hidden assets, leverage opportunities |
| `ant drill` | Interview Readiness | Interactive mock interview sessions — behavioral, system design, technical, why-Anthropic |
| `ant velocity` | Personal Projects | Reads your git history to report actual shipping velocity, not self-reported progress |
| `ant audit` | Online Visibility | Pulls live GitHub data to score your public profile and surface specific next actions |
| `ant contact` | Network | Relationship ledger — log interactions, get suggestions for genuine touchpoints |
| `ant worth-it` | Credentials | Evaluates a credential or course for ROI before you commit time or money |
| `ant spend` | Budget | Tracks spend by category and flags misalignment with current plan priorities |

### Workflow

```
intake → plan → [weekly retro → recalibrate plan] → repeat
             ↕
   dimension commands run anytime
```

---

## Intake Interview

Before generating a plan, the tool interviews you across four areas:

1. **Current role** — What you do day-to-day, what your responsibilities are, what you are learning or not learning
2. **Target role at Anthropic** — What kind of role you are aiming for, what you know about the team or function
3. **Existing skills** — What you are strong in, what you can demonstrate, what is genuinely differentiated about you
4. **Starting constraints** — Time available per week, budget for courses or tools, credentials or degrees you currently hold or lack

Your chosen model uses this to build a profile that persists across sessions.

---

## Action Plan

The plan is a ranked, living document. Claude scores and prioritizes across seven dimensions. Each dimension has its own sub-document describing how it is evaluated, what improvement looks like, and how retros track it.

| # | Dimension | Description |
|---|---|---|
| 1 | [Current Role](docs/dimensions/current-role.md) | Is your day job building your candidacy or just filling time? |
| 2 | [Interview Readiness](docs/dimensions/interviews.md) | Technical depth, behavioral stories, communication under pressure |
| 3 | [Personal Projects](docs/dimensions/projects.md) | Shipping something real that signals the right things |
| 4 | [Online Visibility](docs/dimensions/visibility.md) | GitHub, LinkedIn, writing — what people find when they look you up |
| 5 | [Network and Access](docs/dimensions/network.md) | Who you know, who they know, and how to use it without burning it |
| 6 | [Credentials](docs/dimensions/credentials.md) | What is worth pursuing vs. resume decoration |
| 7 | [Budget](docs/dimensions/budget.md) | Matching spend to priority, not anxiety |

Priorities are not fixed. They shift based on what you report each week.

---

## Weekly Retrospective

Every week, `retro` mode asks:

- What did you actually do from the plan?
- What got in the way?
- What changed in your situation (role, budget, access, timeline)?

The model uses that to score progress, update the plan, and surface what to focus on next week.

Session summaries are written to `sessions/` so there is a running record of where you started and where you are.

---

## LLM Configuration

`be-an-ant` works with any of the following providers. Set your preferred model via environment variable or a config file at `~/.be-an-ant/config.json`.

| Provider | Models supported | Env var |
|---|---|---|
| Anthropic (default) | claude-opus-4, claude-sonnet-4 | `ANTHROPIC_API_KEY` |
| OpenAI | gpt-4o, gpt-4o-mini | `OPENAI_API_KEY` |
| Google | gemini-2.0-flash, gemini-1.5-pro | `GOOGLE_API_KEY` |

If no model is specified, the tool defaults to Claude.

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
