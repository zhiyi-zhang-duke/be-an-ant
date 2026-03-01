# be-an-ant

A personal AI-powered career development system with a single objective: get a job at Anthropic.

The name comes from the idea that ants don't overestimate the distance between where they are and where they need to go — they just move, methodically, one step at a time.

---

## What This Is

`be-an-ant` is a CLI tool that uses an AI model as a structured career coach. It runs intake interviews, builds a prioritized action plan across every relevant dimension of career growth, and holds weekly retrospectives to track progress and recalibrate.

It uses Claude (Anthropic) as the AI backend.

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
| `ant config` | One-time setup — saves your Anthropic API key and Firebase credentials |
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

Session summaries are saved to Firestore so there is a running record of where you started and where you are.

---

## LLM Configuration

`be-an-ant` uses Claude via the Anthropic API. You set your API key during `ant config`. The model can be overridden in `~/.be-an-ant/config.json`.

| Model | Description |
|---|---|
| `claude-opus-4-6` (default) | Most capable — best for intake and plan generation |
| `claude-sonnet-4-6` | Faster — fine for retros and dimension commands |

---

## Installation

Requires Node.js 18 or later.

```bash
git clone https://github.com/zhiyi-zhang-duke/be-an-ant.git
cd be-an-ant
npm install
npm run build
npm link          # makes `ant` available globally
```

---

## Setup

### 1. Firebase

`be-an-ant` stores all session data in Firebase Firestore. You need a Firebase project and a service account before you can use the tool.

Full step-by-step instructions: [`docs/firebase.md`](docs/firebase.md)

The short version:
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore in Native mode
3. Generate a service account key (Project Settings → Service Accounts → Generate new private key)
4. Keep the downloaded JSON — you will paste three values from it into `ant config`

### 2. Configure the CLI

```bash
ant config
```

This prompts for:
- Your Anthropic API key (from [console.anthropic.com](https://console.anthropic.com))
- Firebase project ID, service account email, and private key (from the JSON downloaded above)

Credentials are saved to `~/.be-an-ant/config.json` and never written to the database.

### 3. Before your first session

Collect the following — you will be asked about all of it during `ant intake`:

- Your current job title and a plain-language description of what you do
- The Anthropic role(s) you are targeting (be specific if possible)
- A list of skills you are confident in and skills you suspect are gaps
- Your weekly hours available for this effort
- Your monthly budget (can be zero)
- Your current credentials (degrees, certifications)
- Your GitHub, LinkedIn, and any writing you have published

---

## Progress Tracking

Sessions are stored in **Firebase Firestore**, scoped to your user ID. Each session record contains:

- The mode run (`intake`, `plan`, `retro`)
- Key outputs (updated plan, scores, action items)
- A brief summary of what changed from the previous session

Data syncs automatically across devices. No manual file management.

---

## Technical Design

The full architecture — stack, Firebase data model, Firestore collections, project structure, and system prompt strategy — is documented in [`docs/architecture.md`](docs/architecture.md).

---

## Why This Exists

Getting a job at a specific company is not a vague goal. It is a project. This tool treats it like one.
