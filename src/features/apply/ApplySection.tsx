import { useEffect, useState, type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { applyApi } from '@/lib/api'
import {
  AGE_GROUPS,
  INTERESTS,
  SOURCES,
  TIME_SLOTS,
  applyFormSchema,
  type ApplyFormValues,
} from '@/schemas/apply'

type ApplySectionProps = {
  recommendedCourse?: string
  expandRequest?: number
  onSuccess: (payload: {
    name: string
    interest: string
    recommendedCourse?: string
  }) => void
}

const defaultValues: ApplyFormValues = {
  name: '',
  phone: '',
  email: '',
  ageGroup: '',
  interest: '',
  interestOther: '',
  timeSlot: '',
  timeSlotOther: '',
  source: '',
  consent: false,
}

export function ApplySection({
  recommendedCourse,
  expandRequest = 0,
  onSuccess,
}: ApplySectionProps) {
  const [expanded, setExpanded] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applyFormSchema),
    defaultValues,
    shouldUnregister: false,
  })

  const interest = form.watch('interest')
  const timeSlot = form.watch('timeSlot')

  useEffect(() => {
    if (expandRequest > 0) {
      setExpanded(true)
    }
  }, [expandRequest])

  function openForm() {
    setExpanded(true)
    window.setTimeout(() => {
      document.getElementById('apply-form-card')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 100)
  }

  async function onSubmit(values: ApplyFormValues) {
    setSubmitError('')
    const interests =
      values.interest === '기타' ? values.interestOther.trim() : values.interest
    const slot =
      values.timeSlot === '직접 입력' ? values.timeSlotOther.trim() : values.timeSlot

    try {
      await applyApi({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim() || undefined,
        ageGroup: values.ageGroup,
        interests,
        timeSlot: slot,
        source: values.source,
        recommendedCourse,
      })
      onSuccess({
        name: values.name.trim(),
        interest: interests,
        recommendedCourse,
      })
    } catch (err) {
      console.error(err)
      setSubmitError('신청 접수 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <section id="apply-section" className="px-4 py-10 sm:px-6 sm:py-11">
      <div className="mx-auto w-full max-w-[760px]">
        <h2 className="mb-2 text-[24px] text-navy sm:text-[26px]">무료 체험 신청하기</h2>
        <p className="mb-6 text-base leading-7 text-ink-soft">
          비슷한 내용을 직접 배워보실 수 있어요. 이름과 연락처만 남겨주시면 안내해드릴게요.
        </p>

        {!expanded && (
          <Button
            type="button"
            onClick={openForm}
            className="h-auto w-full rounded-xl bg-coral py-4 text-lg font-bold hover:bg-coral-dark"
          >
            무료체험 신청하기
          </Button>
        )}

        {expanded && (
          <Card
            id="apply-form-card"
            className="mt-5 border-line shadow-[0_4px_18px_rgba(22,39,61,0.06)]"
          >
            <CardContent className="p-4 sm:p-5">
              <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <Field label="이름" error={form.formState.errors.name?.message}>
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        name={field.name}
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        placeholder="예: 홍길동"
                        autoComplete="name"
                        className="h-auto border-2 py-3.5 text-[17px]"
                      />
                    )}
                  />
                </Field>

                <Field label="연락처" error={form.formState.errors.phone?.message}>
                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <Input
                        name={field.name}
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        type="tel"
                        inputMode="tel"
                        placeholder="010-1234-5678"
                        autoComplete="tel"
                        className="h-auto border-2 py-3.5 text-[17px]"
                      />
                    )}
                  />
                </Field>

                <Field label="이메일 (선택)" error={form.formState.errors.email?.message}>
                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <Input
                        name={field.name}
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        type="email"
                        inputMode="email"
                        placeholder="예: example@email.com"
                        autoComplete="email"
                        className="h-auto border-2 py-3.5 text-[17px]"
                      />
                    )}
                  />
                </Field>

                <Field label="연령대" error={form.formState.errors.ageGroup?.message}>
                  <Controller
                    control={form.control}
                    name="ageGroup"
                    render={({ field }) => (
                      <Select
                        value={field.value || null}
                        onValueChange={(value) => field.onChange(value ?? '')}
                      >
                        <SelectTrigger className="h-auto w-full border-2 py-3.5 text-[17px]">
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {AGE_GROUPS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field label="배우고 싶은 것" error={form.formState.errors.interest?.message}>
                  <Controller
                    control={form.control}
                    name="interest"
                    render={({ field }) => (
                      <Select
                        value={field.value || null}
                        onValueChange={(value) => field.onChange(value ?? '')}
                      >
                        <SelectTrigger className="h-auto w-full border-2 py-3.5 text-[17px]">
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {INTERESTS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <div className={interest === '기타' ? 'mt-2.5' : 'hidden'}>
                    <Controller
                      control={form.control}
                      name="interestOther"
                      render={({ field }) => (
                        <Input
                          name={field.name}
                          value={field.value}
                          onChange={(event) => field.onChange(event.target.value)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          placeholder="배우고 싶은 것을 적어주세요"
                          className="h-auto border-2 py-3.5 text-[17px]"
                        />
                      )}
                    />
                  </div>
                  {form.formState.errors.interestOther?.message && (
                    <p className="mt-1 text-sm text-destructive">
                      {form.formState.errors.interestOther.message}
                    </p>
                  )}
                </Field>

                <Field label="희망 시간대" error={form.formState.errors.timeSlot?.message}>
                  <Controller
                    control={form.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <Select
                        value={field.value || null}
                        onValueChange={(value) => field.onChange(value ?? '')}
                      >
                        <SelectTrigger className="h-auto w-full border-2 py-3.5 text-[17px]">
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <div className={timeSlot === '직접 입력' ? 'mt-2.5' : 'hidden'}>
                    <Controller
                      control={form.control}
                      name="timeSlotOther"
                      render={({ field }) => (
                        <Input
                          name={field.name}
                          value={field.value}
                          onChange={(event) => field.onChange(event.target.value)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          placeholder="예: 화요일 오후 2시"
                          className="h-auto border-2 py-3.5 text-[17px]"
                        />
                      )}
                    />
                  </div>
                  {form.formState.errors.timeSlotOther?.message && (
                    <p className="mt-1 text-sm text-destructive">
                      {form.formState.errors.timeSlotOther.message}
                    </p>
                  )}
                </Field>

                <Field label="유입경로" error={form.formState.errors.source?.message}>
                  <Controller
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <Select
                        value={field.value || null}
                        onValueChange={(value) => field.onChange(value ?? '')}
                      >
                        <SelectTrigger className="h-auto w-full border-2 py-3.5 text-[17px]">
                          <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {SOURCES.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Controller
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <label className="flex items-start gap-2.5 text-sm leading-6 text-ink-soft">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                        className="mt-0.5"
                      />
                      <span>
                        (필수) 개인정보 수집·이용에 동의합니다. 남겨주신 정보는 상담 및 안내
                        목적으로만 사용됩니다.
                      </span>
                    </label>
                  )}
                />
                {form.formState.errors.consent?.message && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.consent.message}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-auto w-full rounded-xl bg-coral py-4 text-lg font-bold hover:bg-coral-dark"
                >
                  {form.formState.isSubmitting ? '신청 중이에요...' : '신청하기'}
                </Button>

                {submitError && (
                  <div className="rounded-[14px] border border-[#f1c4af] bg-[#fdeee8] px-5 py-4 text-[15px] text-[#9c4423]">
                    {submitError}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[15px] font-bold text-navy">{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
