# Firebase Setup

`be-an-ant` uses Firebase Firestore to store all session data — your profile, plan, session history, contacts, and spend records. This syncs automatically across devices.

You need a Firebase project and a service account before running `ant config`.

---

## 1. Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project**
3. Enter a project name (e.g. `be-an-ant`)
4. Disable Google Analytics if you don't need it — it is not required
5. Click **Create project**

---

## 2. Enable Firestore

1. In the Firebase Console, open your project
2. In the left sidebar, go to **Build → Firestore Database**
3. Click **Create database**
4. Choose **Native mode** (not Datastore mode)
5. Select a region — pick the one closest to you
6. Click **Done**

The database starts in **test mode**, which allows open reads and writes for 30 days. See the [Security Rules](#security-rules) section below to lock it down before that window expires.

---

## 3. Create a Service Account

The CLI uses a service account to authenticate with Firestore directly — no user login flow required.

1. In the Firebase Console, go to **Project Settings** (gear icon, top left)
2. Click the **Service accounts** tab
3. Under **Firebase Admin SDK**, click **Generate new private key**
4. Click **Generate key** in the confirmation dialog
5. A `.json` file downloads — keep this file secure and do not commit it to git

---

## 4. Extract Credentials

Open the downloaded JSON file. It looks like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  ...
}
```

You need three values from this file:

| Field in JSON | Prompt in `ant config` |
|---|---|
| `project_id` | Firebase project ID |
| `client_email` | Service account client email |
| `private_key` | Private key |

For the private key: paste the full value including the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` markers. The CLI expects `\n` as a literal escape sequence for newlines — copy the value exactly as it appears in the JSON string.

---

## 5. Run `ant config`

```
ant config
```

This prompts for your LLM provider, API key, and the three Firebase values above. Credentials are saved to `~/.be-an-ant/config.json` on your local machine and are never written to Firestore.

---

## Firestore Data Model

All collections are scoped under `/users/{uid}/`. The `uid` is derived from your Firebase project ID, so each service account maps to one user.

| Collection | Written by | Contains |
|---|---|---|
| `profile` | `ant intake` | Your background, target roles, skills, constraints |
| `plan` | `ant plan`, `ant retro` | Ranked action plan across seven dimensions |
| `sessions` | `ant intake`, `ant plan`, `ant retro` | Session summaries and progress history |
| `drills` | `ant drill` | Mock interview transcripts and scores |
| `contacts` | `ant contact` | Relationship ledger and interaction log |
| `spend` | `ant spend` | Spend records by category |
| `projects` | `ant velocity` | Manually tracked project records |

Full schema definitions are in [`docs/data-layer.md`](data-layer.md).

---

## Security Rules

The default test mode rules expire after 30 days. Replace them with the following to lock the database to your service account only.

In the Firebase Console, go to **Firestore Database → Rules** and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

This blocks all client-side access. The CLI uses the Admin SDK via a service account, which bypasses these rules entirely — so the CLI continues to work, and the database is closed to any browser or mobile client.

If you want to add a web dashboard later that reads the same data, you will need to update these rules to allow authenticated reads for your specific user.
