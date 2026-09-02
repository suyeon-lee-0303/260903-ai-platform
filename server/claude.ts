import Anthropic from '@anthropic-ai/sdk'
import { getEnv, requireEnv } from './env.js'

const SYSTEM_ASK = `당신은 모두의 AI평생교육원의 AI 도우미입니다. 40~70대 어르신 눈높이에 맞춰, 일상적인 비유를 사용해서, 존댓말로, 짧고 친절하게 설명하세요. 전문 용어가 나오면 반드시 쉬운 말로 풀어주세요. 답변은 4문장을 넘기지 마세요.`

const SYSTEM_RECOMMEND = `당신은 모두의 AI평생교육원의 학습 상담 도우미입니다.
사용자의 질문과 AI 상담 내용을 보고 맞춤 학습을 추천하세요.
반드시 아래 JSON 형식만 출력하세요. 다른 문장은 넣지 마세요.
{
  "level": "현재 수준 (예: AI 입문)",
  "course": "추천 과정 (예: AI 입문반)",
  "reason": "추천 이유 2~3문장",
  "next": "다음 추천 과정 (예: ChatGPT 활용)"
}
존댓말, 쉬운 말로 작성하세요.`

function getClient() {
  return new Anthropic({ apiKey: requireEnv('ANTHROPIC_API_KEY') })
}

function getModel() {
  return getEnv('ANTHROPIC_MODEL') || 'claude-sonnet-5'
}

export async function askClaude(question: string): Promise<string> {
  const client = getClient()
  const message = await client.messages.create({
    model: getModel(),
    max_tokens: 1000,
    system: SYSTEM_ASK,
    messages: [{ role: 'user', content: question }],
  })

  const text = message.content
    .filter((block) => block.type === 'text')
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('\n')
    .trim()

  if (!text) {
    throw new Error('empty answer')
  }
  return text
}

export type Recommendation = {
  level: string
  course: string
  reason: string
  next: string
}

export async function recommendCourse(
  question: string,
  answer: string,
): Promise<Recommendation> {
  const client = getClient()
  const message = await client.messages.create({
    model: getModel(),
    max_tokens: 800,
    system: SYSTEM_RECOMMEND,
    messages: [
      {
        role: 'user',
        content: `질문:\n${question}\n\n상담 답변:\n${answer}`,
      },
    ],
  })

  const text = message.content
    .filter((block) => block.type === 'text')
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('\n')
    .trim()

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('invalid recommendation format')
  }

  const parsed = JSON.parse(jsonMatch[0]) as Recommendation
  if (!parsed.level || !parsed.course || !parsed.reason || !parsed.next) {
    throw new Error('incomplete recommendation')
  }
  return parsed
}
