# Data Layer

Implementation plan for the Firestore data layer using **Zod schemas as the single source of truth**.

All document types, runtime validation, and typed read/write operations derive from one set of Zod schema definitions — no parallel interface declarations, no hand-written types.

---

## Why Zod

Most documents in this app are populated from parsed LLM responses. Without runtime validation, a hallucinated field or wrong type silently corrupts Firestore data. Zod validates at the boundary — the same schema that gives you TypeScript types also rejects malformed LLM output before it is written.

One definition → TypeScript types + runtime validation + parse errors with context.

---

## File Structure

```
src/
├── schema.ts    # All Zod schemas. Types derived via z.infer<>. Nothing else lives here.
├── db.ts        # Typed read/write functions. Imports from schema.ts and firebase.ts.
└── firebase.ts  # Firestore client and Auth initialization only.
```

No repositories, no classes. `db.ts` exports plain async functions.

---

## schema.ts

One schema per Firestore collection. All TypeScript types are derived — never declared separately.

```ts
import { z } from 'zod'

// --- Shared primitives ---

const TimestampSchema = z.object({
  seconds: z.number(),
  nanoseconds: z.number(),
})

const ActionSchema = z.object({
  text: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
})

const InteractionSchema = z.object({
  date: z.string(), // ISO date string
  note: z.string(),
})

// --- Collections ---

export const ProfileSchema = z.object({
  currentRole: z.object({
    title: z.string(),
    description: z.string(),
    aiAdjacent: z.boolean(),
  }),
  targetRoles: z.array(z.string()),
  skills: z.object({
    strong: z.array(z.string()),
    gaps: z.array(z.string()),
  }),
  constraints: z.object({
    hoursPerWeek: z.number(),
    monthlyBudget: z.number(),
  }),
  credentials: z.array(z.string()),
  links: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    writing: z.array(z.string()).optional(),
  }),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
})

export const PlanDimensionSchema = z.object({
  id: z.string(),
  rank: z.number().int().min(1).max(7),
  score: z.number().int().min(1).max(5),
  rationale: z.string(),
  actions: z.array(ActionSchema),
})

export const PlanSchema = z.object({
  dimensions: z.array(PlanDimensionSchema),
  generatedAt: TimestampSchema,
  updatedAt: TimestampSchema,
})

export const SessionSchema = z.object({
  type: z.enum(['intake', 'plan', 'retro']),
  date: z.string(),
  summary: z.string(),
  planChanges: z.array(z.string()),
  createdAt: TimestampSchema,
})

export const DrillSchema = z.object({
  type: z.enum(['behavioral', 'technical', 'system-design']),
  date: z.string(),
  durationMinutes: z.number(),
  feedback: z.string(),
  competenciesCovered: z.array(z.string()),
  weaknesses: z.array(z.string()),
  createdAt: TimestampSchema,
})

export const ContactSchema = z.object({
  name: z.string(),
  tags: z.array(z.string()),
  howWeKnow: z.string(),
  interactions: z.array(InteractionSchema),
  lastSuggestedAt: TimestampSchema.optional(),
  createdAt: TimestampSchema,
})

export const SpendSchema = z.object({
  category: z.enum(['course', 'book', 'tool', 'coaching', 'other']),
  amount: z.number(),
  note: z.string(),
  month: z.string(), // YYYY-MM
  createdAt: TimestampSchema,
})

export const ProjectSchema = z.object({
  name: z.string(),
  path: z.string(),
  addedAt: TimestampSchema,
})

// --- Derived types (never declared manually) ---

export type Profile       = z.infer<typeof ProfileSchema>
export type Plan          = z.infer<typeof PlanSchema>
export type PlanDimension = z.infer<typeof PlanDimensionSchema>
export type Session       = z.infer<typeof SessionSchema>
export type Drill         = z.infer<typeof DrillSchema>
export type Contact       = z.infer<typeof ContactSchema>
export type Spend         = z.infer<typeof SpendSchema>
export type Project       = z.infer<typeof ProjectSchema>
```

---

## db.ts

Thin async functions. Each validates with the relevant schema on read. Writes do not re-validate (callers are responsible for constructing valid data), but LLM output is always parsed before being passed to a write function — see LLM Output below.

```ts
import { db, uid } from './firebase'
import {
  ProfileSchema, PlanSchema, SessionSchema,
  DrillSchema, ContactSchema, SpendSchema, ProjectSchema,
  type Profile, type Plan, type Session,
  type Drill, type Contact, type Spend, type Project,
} from './schema'

// Convenience: /users/{uid}
const userRef = () => db.collection('users').doc(uid())

// --- Profile (single document) ---

export async function getProfile(): Promise<Profile | null> {
  const snap = await userRef().collection('profile').doc('default').get()
  if (!snap.exists) return null
  return ProfileSchema.parse(snap.data())
}

export async function saveProfile(data: Profile): Promise<void> {
  await userRef().collection('profile').doc('default').set(data)
}

// --- Plan (single document) ---

export async function getPlan(): Promise<Plan | null> {
  const snap = await userRef().collection('plan').doc('current').get()
  if (!snap.exists) return null
  return PlanSchema.parse(snap.data())
}

export async function savePlan(data: Plan): Promise<void> {
  await userRef().collection('plan').doc('current').set(data)
}

// --- Sessions (collection) ---

export async function addSession(data: Omit<Session, 'createdAt'>): Promise<void> {
  await userRef().collection('sessions').add({
    ...data,
    createdAt: new Date(),
  })
}

export async function getSessions(): Promise<Session[]> {
  const snap = await userRef().collection('sessions').orderBy('createdAt', 'desc').get()
  return snap.docs.map(d => SessionSchema.parse(d.data()))
}

// --- Drills (collection) ---

export async function addDrill(data: Omit<Drill, 'createdAt'>): Promise<void> {
  await userRef().collection('drills').add({ ...data, createdAt: new Date() })
}

export async function getDrills(): Promise<Drill[]> {
  const snap = await userRef().collection('drills').orderBy('createdAt', 'desc').get()
  return snap.docs.map(d => DrillSchema.parse(d.data()))
}

// --- Contacts (collection) ---

export async function addContact(data: Omit<Contact, 'createdAt'>): Promise<void> {
  await userRef().collection('contacts').add({ ...data, createdAt: new Date() })
}

export async function getContacts(): Promise<Contact[]> {
  const snap = await userRef().collection('contacts').orderBy('name').get()
  return snap.docs.map(d => ContactSchema.parse(d.data()))
}

// --- Spend (collection) ---

export async function addSpend(data: Omit<Spend, 'createdAt'>): Promise<void> {
  await userRef().collection('spend').add({ ...data, createdAt: new Date() })
}

export async function getSpend(month?: string): Promise<Spend[]> {
  let query = userRef().collection('spend').orderBy('createdAt', 'desc')
  if (month) query = query.where('month', '==', month) as typeof query
  const snap = await query.get()
  return snap.docs.map(d => SpendSchema.parse(d.data()))
}

// --- Projects (collection) ---

export async function addProject(data: Omit<Project, 'addedAt'>): Promise<void> {
  await userRef().collection('projects').add({ ...data, addedAt: new Date() })
}

export async function getProjects(): Promise<Project[]> {
  const snap = await userRef().collection('projects').get()
  return snap.docs.map(d => ProjectSchema.parse(d.data()))
}
```

---

## LLM Output Validation

Commands that write LLM responses to Firestore must parse through the schema before calling a write function. The pattern is consistent across all commands:

```ts
// In a command file, e.g. commands/plan.ts
import { PlanSchema } from '../schema'
import { savePlan } from '../db'

const raw = await llm(systemPrompt, userMessage)  // returns string
const parsed = JSON.parse(raw)                     // throws if not JSON
const plan = PlanSchema.parse(parsed)              // throws if schema mismatch
await savePlan(plan)                               // only reached if both pass
```

`ZodError` surfaces with field-level detail, making it easy to diagnose and fix the prompt if the LLM output shape is wrong.

---

## Timestamp Handling

Firestore `Timestamp` objects are stored natively. The `TimestampSchema` in `schema.ts` matches the `{ seconds, nanoseconds }` shape that Firestore returns on read. Commands that need a JavaScript `Date` for display call `new Date(ts.seconds * 1000)` inline — no conversion layer needed.

---

## Error Handling

All `db.ts` functions throw on failure. Commands are responsible for catching errors at the CLI boundary and printing a user-facing message. No silent fallbacks inside the data layer.
