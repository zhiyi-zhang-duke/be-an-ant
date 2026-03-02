import { db, uid } from './firebase'
import {
  ProfileSchema, PlanSchema, SessionSchema,
  type Profile, type Plan, type Session,
} from './schema'

const userRef = () => db().collection('users').doc(uid())

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
  const record: Session = { ...data, createdAt: new Date().toISOString() }
  await userRef().collection('sessions').add(record)
}

export async function getSessions(): Promise<Session[]> {
  const snap = await userRef().collection('sessions').orderBy('createdAt', 'desc').get()
  return snap.docs.map(d => SessionSchema.parse(d.data()))
}
