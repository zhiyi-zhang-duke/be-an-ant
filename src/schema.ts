import { z } from 'zod'

// --- Shared primitives ---

const ActionSchema = z.object({
  text: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
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
  dimensionContext: z.record(z.string(), z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
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
  generatedAt: z.string(),
  updatedAt: z.string(),
})

export const SessionSchema = z.object({
  type: z.enum(['intake', 'plan', 'retro']),
  date: z.string(),
  summary: z.string(),
  planChanges: z.array(z.string()),
  createdAt: z.string(),
})

// Stub schemas for post-MVP commands (not yet used, but defined for consistency)

export const DrillSchema = z.object({
  type: z.enum(['behavioral', 'technical', 'system-design', 'why-anthropic']),
  date: z.string(),
  durationMinutes: z.number(),
  feedback: z.string(),
  competenciesCovered: z.array(z.string()),
  weaknesses: z.array(z.string()),
  createdAt: z.string(),
})

export const ContactSchema = z.object({
  name: z.string(),
  tags: z.array(z.string()),
  howWeKnow: z.string(),
  interactions: z.array(z.object({ date: z.string(), note: z.string() })),
  createdAt: z.string(),
})

export const SpendSchema = z.object({
  category: z.enum(['course', 'book', 'tool', 'coaching', 'other']),
  amount: z.number(),
  note: z.string(),
  month: z.string(),
  createdAt: z.string(),
})

export const ProjectSchema = z.object({
  name: z.string(),
  path: z.string(),
  addedAt: z.string(),
})

// --- Derived types ---

export type Profile       = z.infer<typeof ProfileSchema>
export type Plan          = z.infer<typeof PlanSchema>
export type PlanDimension = z.infer<typeof PlanDimensionSchema>
export type Session       = z.infer<typeof SessionSchema>
export type Drill         = z.infer<typeof DrillSchema>
export type Contact       = z.infer<typeof ContactSchema>
export type Spend         = z.infer<typeof SpendSchema>
export type Project       = z.infer<typeof ProjectSchema>
