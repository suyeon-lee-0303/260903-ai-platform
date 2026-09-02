export type Recommendation = {
  level: string
  course: string
  reason: string
  next: string
}

type ApiError = {
  result: 'error'
  message?: string
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await response.json()) as T | ApiError
  if (!response.ok || (data as ApiError).result === 'error') {
    throw new Error((data as ApiError).message || 'request failed')
  }
  return data as T
}

export async function askApi(question: string) {
  return postJson<{ result: 'success'; answer: string }>('/api/ask', { question })
}

export async function recommendApi(question: string, answer: string) {
  return postJson<{ result: 'success'; recommendation: Recommendation }>(
    '/api/recommend',
    { question, answer },
  )
}

export async function applyApi(payload: {
  name: string
  phone: string
  email?: string
  ageGroup: string
  interests: string
  timeSlot: string
  source: string
  recommendedCourse?: string
}) {
  return postJson<{ result: 'success'; mode: 'sheets' }>('/api/apply', payload)
}
