import type { VercelRequest, VercelResponse } from '@vercel/node'
import { saveApplication, type ApplyPayload } from '../server/apply.js'
import { loadEnvFiles } from '../server/env.js'

loadEnvFiles()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ result: 'error', message: 'method not allowed' })
    return
  }

  try {
    const body = req.body as ApplyPayload
    if (
      !body?.name ||
      !body?.phone ||
      !body?.ageGroup ||
      !body?.interests ||
      !body?.timeSlot ||
      !body?.source
    ) {
      res.status(400).json({ result: 'error', message: 'missing required fields' })
      return
    }
    const saved = await saveApplication(body)
    res.status(200).json(saved)
  } catch (err) {
    console.error('apply error:', err)
    res.status(500).json({
      result: 'error',
      message: err instanceof Error ? err.message : 'unknown error',
    })
  }
}
