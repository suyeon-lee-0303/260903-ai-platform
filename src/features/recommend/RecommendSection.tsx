import { useEffect, useState } from 'react'
import { ArrowRight, GraduationCap, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoadingDots } from '@/components/LoadingDots'
import { recommendApi, type Recommendation } from '@/lib/api'

type RecommendSectionProps = {
  question: string
  answer: string
  onReady: (recommendation: Recommendation | null) => void
  onApplyClick: () => void
}

export function RecommendSection({
  question,
  answer,
  onReady,
  onApplyClick,
}: RecommendSectionProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<Recommendation | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      setLoading(true)
      setError('')
      setData(null)
      onReady(null)

      try {
        const res = await recommendApi(question, answer)
        if (cancelled) return
        setData(res.recommendation)
        onReady(res.recommendation)
      } catch (err) {
        console.error(err)
        if (cancelled) return
        setError('추천을 생성하지 못했습니다.\n잠시 후 다시 시도해주세요.')
        onReady(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [question, answer, onReady])

  if (!question || !answer) return null

  return (
    <section className="animate-in fade-in px-4 py-4 duration-500 sm:px-6">
      <div className="mx-auto w-full max-w-[760px]">
        {loading && (
          <Card className="border-line shadow-[0_4px_18px_rgba(22,39,61,0.06)]">
            <CardContent className="p-5 sm:p-6">
              <LoadingDots label="맞춤 학습 추천을 준비하고 있어요" />
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="rounded-[14px] border border-[#f1c4af] bg-[#fdeee8] px-5 py-4 text-[15px] whitespace-pre-wrap text-[#9c4423]">
            {error}
          </div>
        )}

        {data && !loading && (
          <Card className="gap-0 border-line py-0 shadow-[0_4px_18px_rgba(22,39,61,0.06)]">
            <CardHeader className="gap-3 border-b border-line px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent text-teal-dark">
                  <GraduationCap className="size-5" aria-hidden />
                </span>
                <CardTitle className="font-serif text-xl text-navy sm:text-2xl">
                  AI 추천 학습 과정
                </CardTitle>
              </div>
              <CardDescription className="text-[15px] text-ink-soft">
                상담 내용을 바탕으로 맞는 학습 방향을 제안해 드려요.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-5 py-5 sm:space-y-7 sm:px-6 sm:py-6">
              <div className="space-y-2.5">
                <p className="text-sm font-bold text-ink-soft">현재 수준</p>
                <Badge
                  variant="secondary"
                  className="h-auto rounded-full border border-teal/30 bg-accent px-3.5 py-1.5 text-[15px] leading-normal font-bold whitespace-normal text-teal-dark"
                >
                  {data.level}
                </Badge>
              </div>

              <div className="rounded-2xl border border-teal/20 bg-accent/70 px-4 py-5 sm:px-5 sm:py-6">
                <p className="mb-2 text-sm font-bold tracking-wide text-teal-dark">
                  추천 과정
                </p>
                <p className="font-serif text-[26px] leading-snug font-bold break-keep text-navy sm:text-[30px]">
                  {data.course}
                </p>
              </div>

              <div className="space-y-2.5">
                <p className="text-sm font-bold text-ink-soft">추천 이유</p>
                <p className="text-[17px] leading-8 whitespace-pre-wrap break-keep text-ink sm:text-lg sm:leading-9">
                  {data.reason}
                </p>
              </div>

              <div className="space-y-2.5">
                <p className="text-sm font-bold text-ink-soft">다음 추천 과정</p>
                <div className="flex items-start gap-3 rounded-xl border border-line bg-page-bg px-4 py-3.5">
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-coral ring-1 ring-line">
                    <Sparkles className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-wide text-ink-soft uppercase">
                      Next
                      <ArrowRight className="size-3.5" aria-hidden />
                    </p>
                    <p className="text-[17px] leading-7 font-semibold break-keep text-navy sm:text-lg">
                      {data.next}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-line bg-transparent px-5 pt-0 pb-5 sm:px-6 sm:pb-6">
              <Button
                type="button"
                onClick={onApplyClick}
                className="h-auto w-full rounded-xl bg-coral py-4 text-lg font-bold hover:bg-coral-dark"
              >
                무료 체험 신청하기
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </section>
  )
}
