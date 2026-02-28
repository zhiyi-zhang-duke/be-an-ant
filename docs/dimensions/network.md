# Dimension: Network and Access

You probably already know people who could help you. Most of them are underutilized. This dimension tracks who you have access to, how you are using those relationships, and where the gaps are.

---

## What This Covers

- People you know who work at Anthropic or have worked there
- Former colleagues, managers, or collaborators who are now in relevant roles
- People in your extended network who could make an introduction
- Communities you are part of where relevant people participate
- How you are currently using (or not using) these relationships

---

## How the AI Evaluates It

During intake, you describe your network as you understand it. The model does not ask you to name-drop — it asks you to think structurally:

1. **Direct access** — do you know anyone at Anthropic personally?
2. **One degree out** — do you know people who know people there?
3. **Community access** — are you in spaces where Anthropic engineers or researchers show up?

The model then helps you think about how to activate these relationships without being transactional or burning them.

---

## What Improvement Looks Like

- Having a genuine conversation (not a cold ask) with at least one person who has worked at Anthropic
- Getting a referral when you are actually ready — not before
- Being in at least one technical community where relevant people participate
- Being able to point to a relationship that started because of your work, not just your outreach

The best network outcomes come from having something real to talk about. Building `be-an-ant` or another visible project gives you that.

---

## How Retros Track It

Each week you report:

- Whether you had any relevant conversations
- Whether any new connections were made
- Whether any existing relationships moved forward

The model does not push you to hustle your contacts. It tracks whether your network is slowly expanding or stagnant, and adjusts the plan accordingly.

---

## CLI Command: `ant contact`

A lightweight relationship ledger — not a CRM. Tracks who you know, how you know them, and when you last interacted. Surfaces natural touchpoints based on what you're currently building.

```
ant contact add
ant contact log
ant contact suggest
```

**`add`:** Records a person interactively — name, how you know them, tags (anthropic-employee, former-colleague, community-member, recruiter), and any relevant context. Stored locally in `~/.be-an-ant/contacts.json`.

**`log`:** Records an interaction — a conversation, a share of your work, a reply to something they posted. Keeps a timestamped history without requiring detail.

**`suggest`:** Given your contact list and current plan priorities, surfaces one or two people worth a genuine touchpoint this week. Suggestions are anchored to something real — sharing something you just shipped, not a cold ask. Will not suggest the same person two weeks in a row.
