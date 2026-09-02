import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { LoadingDots } from '@/components/LoadingDots'
import { askApi } from '@/lib/api'

const EXAMPLE_QUESTIONS = [
  '요즘 사람들이 쓰는 AI가 뭐예요?',
  '프롬프트가 무슨 뜻이에요?',
  '카톡으로 사진을 크게 보내고 싶어요',
  '생성형 AI로 제가 뭘 할 수 있어요?',
]

type ConsultSectionProps = {
  onAnswered: (payload: { question: string; answer: string }) => void
}

export function ConsultSection({ onAnswered }: ConsultSectionProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAsk() {
    const q = question.trim()
    if (!q) {
      setError('질문을 먼저 적어주세요.')
      setAnswer('')
      return
    }

    setLoading(true)
    setError('')
    setAnswer('')

    try {
      const data = await askApi(q)
      setAnswer(data.answer)
      onAnswered({ question: q, answer: data.answer })
    } catch (err) {
      console.error(err)
      setError('일시적으로 답변을 가져오지 못했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="px-4 pt-10 pb-5 sm:px-6 sm:pt-12">
      <div className="mx-auto max-w-[760px]">
        <h2 className="mb-2 text-[26px] text-navy">지금 바로 물어보세요</h2>
        <p className="mb-6 text-base text-ink-soft">
          아래 예시를 눌러보거나, 직접 궁금한 것을 적어보세요.
        </p>

        <div className="mb-5 flex flex-wrap gap-2.5">
          {EXAMPLE_QUESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQuestion(item)}
              className="rounded-full border-[1.5px] border-line bg-white px-4 py-2.5 text-[15px] font-medium text-navy transition hover:border-teal hover:bg-accent hover:text-teal-dark"
            >
              {item.includes('카톡') ? '카톡 사진 크게 보내기' : item.includes('생성형') ? '생성형 AI로 뭘 할 수 있나요?' : item}
            </button>
          ))}
        </div>

        <Card className="border-line shadow-[0_4px_18px_rgba(22,39,61,0.06)]">
          <CardContent className="space-y-3 p-5">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="여기에 궁금한 점을 적어주세요. 예: 챗지피티가 뭔가요?"
              className="min-h-[84px] border-2 text-[17px]"
            />
            <Button
              type="button"
              onClick={handleAsk}
              disabled={loading}
              className="h-auto w-full rounded-xl bg-teal py-4 text-lg font-bold hover:bg-teal-dark"
            >
              {loading ? '답변을 준비하고 있어요...' : 'AI 도우미에게 물어보기'}
            </Button>

            <div className="min-h-5 pt-2">
              {loading && <LoadingDots label="AI 도우미가 생각하고 있어요" />}
              {error && (
                <div className="rounded-[14px] border border-[#f1c4af] bg-[#fdeee8] px-5 py-4 text-[15px] text-[#9c4423]">
                  {error}
                </div>
              )}
              {answer && !loading && (
                <div className="rounded-[14px] border border-[#cbe9dd] bg-[#f0faf6] px-5 py-[18px] text-[17px] whitespace-pre-wrap text-ink">
                  <span className="mb-2 block text-sm font-bold text-teal-dark">AI 도우미</span>
                  {answer}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
