# Dimension: Personal Projects

A personal project that earns genuine attention from the right people is worth more than almost any credential. This dimension tracks whether you are building something that signals the right things — and whether you are shipping it, not just thinking about it.

---

## What This Covers

- What you are building outside of work
- Whether the project is AI-native or adjacent to the problems Anthropic is working on
- How the project is documented, presented, and discoverable
- Whether it demonstrates original thinking or just technical execution
- How it fits into the story you want to tell

---

## How the AI Evaluates It

During intake, you describe any active or planned personal projects. The model assesses:

1. **Signal quality** — would a hiring engineer at Anthropic find this interesting? Why or why not?
2. **Completion risk** — is this the kind of project that gets abandoned at 60%?
3. **Surface area** — can people actually find this, use it, and understand what it does?

Projects that use Claude's API thoughtfully, solve real problems for developers, or contribute to the AI tooling ecosystem score highest for this target.

**Note:** `be-an-ant` itself is a personal project. It is simultaneously the tool and the portfolio piece.

---

## What Improvement Looks Like

- A project with a real README, real commits, and evidence of iteration
- Something you can demo in five minutes in an interview
- Published, not just "in progress" — even if it is early
- A clear one-sentence description of what it does and why you built it
- Optional but valuable: external engagement (stars, forks, mentions, blog posts)

---

## How Retros Track It

Each week you report:

- What you shipped, wrote, or documented
- Whether you shared it anywhere
- Whether anything changed in scope or direction

The model tracks shipping velocity. If weeks pass without visible progress, it will escalate this dimension's priority and suggest ways to reduce scope to something shippable.

---

## CLI Command: `ant velocity`

Points at a local git repository and reads the actual commit history to calculate shipping velocity — not what you say you did, but what the repo shows. Honest in a way retro self-reporting isn't.

```
ant velocity
ant velocity ~/projects/openclaw
ant velocity --all
```

**Output:** Days since last commit, commit frequency over the past 30 days, trend (accelerating / stable / stalling), and a trajectory estimate based on current pace. Also flags stall signals in commit messages — high frequency of `wip`, `temp`, `fix typo`, or consecutive commits with no substance.

`--all` scans all registered projects and outputs a side-by-side velocity comparison.

Projects are registered during intake or with `ant velocity --add ~/path/to/project`. The retro command pulls velocity data automatically — you don't have to self-report project progress if your repo is registered.
