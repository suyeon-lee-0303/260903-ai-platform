import type { VercelRequest, VercelResponse } from '@vercel/node'
import { recommendCourse } from '../server/claude.js'
import { loadEnvFiles } from '../server/env.js'

loadEnvFiles()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ result: 'error', message: 'method not allowed' })
    return
  }

  try {
    const question = String(req.body?.question ?? '').trim()
    const answer = String(req.body?.answer ?? '').trim()
    if (!question || !answer) {
      res.status(400).json({ result: 'error', message: 'question and answer required' })
      return
    }
    const recommendation = await recommendCourse(question, answer)
    res.status(200).json({ result: 'success', recommendation })
  } catch (err) {
    console.error('recommend error:', err)
    res.status(500).json({
      result: 'error',
      message: err instanceof Error ? err.message : 'unknown error',
    })
  }
}
