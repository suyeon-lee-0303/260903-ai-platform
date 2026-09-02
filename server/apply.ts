import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { google } from 'googleapis'
import { getEnv, requireEnv } from './env.js'

export type ApplyPayload = {
  name: string
  phone: string
  email?: string
  ageGroup: string
  interests: string
  timeSlot: string
  source: string
  recommendedCourse?: string
}

export type ApplyResult = {
  result: 'success' | 'error'
  message?: string
  mode: 'sheets'
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Column order matches legacy Code.gs handleApply:
 * [timestamp, name, phone, interests, email, ageGroup, timeSlot, source]
 */
function buildRow(data: ApplyPayload): (string | Date)[] {
  return [
    new Date().toISOString(),
    data.name,
    data.phone,
    data.interests,
    data.email ?? '',
    data.ageGroup,
    data.timeSlot,
    data.source,
  ]
}

function normalizePrivateKey(raw: string): string {
  let key = raw.trim()
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1)
  }
  return key.replace(/\\n/g, '\n')
}

type ServiceAccountCreds = {
  client_email: string
  private_key: string
}

function loadCredentials(): { email: string; privateKey: string } {
  const configuredPath = getEnv('GOOGLE_SERVICE_ACCOUNT_FILE')
  const candidates = [
    configuredPath,
    path.join(rootDir, 'service-account.json'),
  ].filter(Boolean) as string[]

  for (const candidate of candidates) {
    const absolute = path.isAbsolute(candidate)
      ? candidate
      : path.join(rootDir, candidate)
    if (!fs.existsSync(absolute)) continue
    const parsed = JSON.parse(fs.readFileSync(absolute, 'utf8')) as ServiceAccountCreds
    if (parsed.client_email && parsed.private_key) {
      return {
        email: parsed.client_email,
        privateKey: parsed.private_key,
      }
    }
  }

  return {
    email: requireEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
    privateKey: normalizePrivateKey(requireEnv('GOOGLE_PRIVATE_KEY')),
  }
}

async function appendToSheets(data: ApplyPayload): Promise<void> {
  const { email, privateKey } = loadCredentials()
  const spreadsheetId = requireEnv('GOOGLE_SHEETS_ID')
  const range = getEnv('GOOGLE_SHEETS_RANGE') || '시트1!A:H'

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [buildRow(data)],
    },
  })
}

export async function saveApplication(data: ApplyPayload): Promise<ApplyResult> {
  await appendToSheets(data)
  return { result: 'success', mode: 'sheets' }
}
