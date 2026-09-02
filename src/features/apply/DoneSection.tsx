import { Card, CardContent } from '@/components/ui/card'

type DoneSectionProps = {
  name: string
  interest: string
  recommendedCourse?: string
}

export function DoneSection({ name, interest, recommendedCourse }: DoneSectionProps) {
  return (
    <section id="done-section" className="px-4 py-10 sm:px-6 sm:py-11">
      <div className="mx-auto w-full max-w-[760px]">
        <Card className="border-line text-center shadow-[0_4px_18px_rgba(22,39,61,0.06)]">
          <CardContent className="px-5 py-10 sm:px-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal text-[28px] text-white">
              ✓
            </div>
            <h3 className="mb-3 font-serif text-[22px] leading-snug break-keep text-navy sm:text-[24px]">
              {name}님, '{interest}' 신청이 완료되었습니다!
            </h3>
            {recommendedCourse && (
              <p className="mb-4 rounded-xl bg-accent px-4 py-3 text-base break-keep text-teal-dark">
                추천 과정: <strong>{recommendedCourse}</strong>
              </p>
            )}
            <p className="text-base leading-7 text-ink-soft">
              1~2일 안에 전화 또는 문자로
              <br />
              무료 체험 일정을 안내드릴게요.
            </p>
            <p className="mt-5 text-sm text-ink-soft">소중한 신청 감사합니다.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
