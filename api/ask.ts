import type { VercelRequest, VercelResponse } from '@vercel/node'
import { askClaude } from '../server/claude.js'
import { loadEnvFiles } from '../server/env.js'

loadEnvFiles()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ result: 'error', message: 'method not allowed' })
    return
  }

  try {
    const question = String(req.body?.question ?? '').trim()
    if (!question) {
      res.status(400).json({ result: 'error', message: 'question required' })
      return
    }
    const answer = await askClaude(question)
    res.status(200).json({ result: 'success', answer })
  } catch (err) {
    console.error('ask error:', err)
    res.status(500).json({
      result: 'error',
      message: err instanceof Error ? err.message : 'unknown error',
    })
  }
}
