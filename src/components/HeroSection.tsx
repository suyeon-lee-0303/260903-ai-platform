export function HeroSection() {
  return (
    <section className="bg-[radial-gradient(circle_at_85%_-10%,#2b4560_0%,var(--navy)_55%)] px-4 py-14 text-white sm:px-6 md:py-20">
      <div className="mx-auto max-w-[760px]">
        <span className="mb-5 inline-block rounded-full border border-white/25 bg-white/12 px-3.5 py-1.5 text-sm font-bold tracking-wide">
          모두의 AI평생교육원
        </span>
        <h1 className="mb-4 text-3xl leading-snug font-bold md:text-[40px]">
          AI가 어려워도 괜찮아요.
          <br />
          질문 하나로 시작해요.
        </h1>
        <p className="max-w-[520px] text-lg text-[#d8dee6] md:text-[19px]">
          AI 상담 서비스입니다. 궁금한 걸 편하게 물어보세요
          <br />— AI가 눈높이에 맞춰 바로 답해드려요.
        </p>
      </div>
    </section>
  )
}
