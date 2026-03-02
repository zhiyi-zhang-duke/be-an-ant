import * as admin from 'firebase-admin'
import { requireConfig } from './config'

let _db: admin.firestore.Firestore | null = null
let _uid: string | null = null

export function initFirebase(): void {
  if (_db) return

  const config = requireConfig()

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
    })
  }

  _db = admin.firestore()

  // Use projectId as a stable user identifier for the service account context.
  // Each config file represents one user. The uid is derived deterministically
  // so that data persists across CLI invocations without a real auth flow.
  _uid = `user_${config.firebase.projectId}`
}

export function db(): admin.firestore.Firestore {
  if (!_db) initFirebase()
  return _db!
}

export function uid(): string {
  if (!_uid) initFirebase()
  return _uid!
}
