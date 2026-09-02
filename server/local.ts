import cors from 'cors'
import express from 'express'
import { askClaude, recommendCourse } from './claude.js'
import { saveApplication, type ApplyPayload } from './apply.js'
import { getEnv, loadEnvFiles } from './env.js'

loadEnvFiles()

const app = express()
const port = Number(getEnv('API_PORT') || 3001)

app.use(cors())
app.use(express.json())

app.post('/api/ask', async (req, res) => {
  try {
    const question = String(req.body?.question ?? '').trim()
    if (!question) {
      res.status(400).json({ result: 'error', message: 'question required' })
      return
    }
    if (!getEnv('ANTHROPIC_API_KEY')) {
      res.status(500).json({
        result: 'error',
        message: 'ANTHROPIC_API_KEY is not set in .env — API 서버를 재시작해주세요.',
      })
      return
    }
    const answer = await askClaude(question)
    res.json({ result: 'success', answer })
  } catch (err) {
    console.error('ask error:', err)
    res.status(500).json({
      result: 'error',
      message: err instanceof Error ? err.message : 'unknown error',
    })
  }
})

app.post('/api/recommend', async (req, res) => {
  try {
    const question = String(req.body?.question ?? '').trim()
    const answer = String(req.body?.answer ?? '').trim()
    if (!question || !answer) {
      res.status(400).json({ result: 'error', message: 'question and answer required' })
      return
    }
    const recommendation = await recommendCourse(question, answer)
    res.json({ result: 'success', recommendation })
  } catch (err) {
    console.error('recommend error:', err)
    res.status(500).json({
      result: 'error',
      message: err instanceof Error ? err.message : 'unknown error',
    })
  }
})

app.post('/api/apply', async (req, res) => {
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
    res.json(saved)
  } catch (err) {
    console.error('apply error:', err)
    res.status(500).json({
      result: 'error',
      message: err instanceof Error ? err.message : 'unknown error',
    })
  }
})

app.listen(port, () => {
  const keyReady = Boolean(getEnv('ANTHROPIC_API_KEY'))
  console.log(`API server listening on http://127.0.0.1:${port}`)
  console.log(`ANTHROPIC_API_KEY: ${keyReady ? 'loaded' : 'MISSING'}`)
  console.log(`ANTHROPIC_MODEL: ${getEnv('ANTHROPIC_MODEL') || 'claude-sonnet-5'}`)
})
