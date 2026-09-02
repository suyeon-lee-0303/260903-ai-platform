import { useCallback, useState } from 'react'
import { HeroSection } from '@/components/HeroSection'
import { ApplySection } from '@/features/apply/ApplySection'
import { DoneSection } from '@/features/apply/DoneSection'
import { ConsultSection } from '@/features/consult/ConsultSection'
import { RecommendSection } from '@/features/recommend/RecommendSection'
import type { Recommendation } from '@/lib/api'

type ConsultResult = {
  question: string
  answer: string
}

type DoneState = {
  name: string
  interest: string
  recommendedCourse?: string
}

export default function App() {
  const [consult, setConsult] = useState<ConsultResult | null>(null)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [done, setDone] = useState<DoneState | null>(null)
  const [applyExpandRequest, setApplyExpandRequest] = useState(0)

  const handleRecommendReady = useCallback((value: Recommendation | null) => {
    setRecommendation(value)
  }, [])

  function openApplyForm() {
    setApplyExpandRequest((count) => count + 1)
    window.setTimeout(() => {
      document.getElementById('apply-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
  }

  return (
    <div className="min-h-screen bg-page-bg">
      <HeroSection />

      {!done && (
        <>
          <ConsultSection
            onAnswered={(payload) => {
              setConsult(payload)
              setRecommendation(null)
            }}
          />

          {consult && (
            <RecommendSection
              question={consult.question}
              answer={consult.answer}
              onReady={handleRecommendReady}
              onApplyClick={openApplyForm}
            />
          )}

          <ApplySection
            recommendedCourse={recommendation?.course}
            expandRequest={applyExpandRequest}
            onSuccess={(payload) => {
              setDone(payload)
              window.setTimeout(() => {
                document.getElementById('done-section')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }, 50)
            }}
          />
        </>
      )}

      {done && (
        <DoneSection
          name={done.name}
          interest={done.interest}
          recommendedCourse={done.recommendedCourse}
        />
      )}

      <footer className="px-4 pb-16 text-[13px] leading-8 text-ink-soft sm:px-6">
        <div className="mx-auto max-w-[760px] border-t border-line pt-5">
          © 2026 디지털이음 AI교육원. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
