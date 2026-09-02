import { z } from 'zod'

export const applyFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, '이름을 입력해주세요.')
      .max(40, '이름은 40자 이내로 입력해주세요.'),
    phone: z
      .string()
      .trim()
      .min(1, '연락처를 입력해주세요.')
      .regex(
        /^01[016789]-?\d{3,4}-?\d{4}$/,
        '연락처 형식을 확인해주세요. 예: 010-1234-5678',
      ),
    email: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || z.email().safeParse(value).success,
        '이메일 형식을 확인해주세요.',
      ),
    ageGroup: z.string().min(1, '연령대를 선택해주세요.'),
    interest: z.string().min(1, '배우고 싶은 것을 선택해주세요.'),
    interestOther: z.string(),
    timeSlot: z.string().min(1, '희망 시간대를 선택해주세요.'),
    timeSlotOther: z.string(),
    source: z.string().min(1, '유입경로를 선택해주세요.'),
    consent: z.boolean().refine((value) => value === true, {
      message: '개인정보 수집·이용 동의가 필요해요.',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.interest === '기타' && !data.interestOther.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['interestOther'],
        message: '배우고 싶은 것을 직접 적어주세요.',
      })
    }
    if (data.timeSlot === '직접 입력' && !data.timeSlotOther.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['timeSlotOther'],
        message: '희망 시간대를 직접 적어주세요.',
      })
    }
  })

export type ApplyFormValues = z.infer<typeof applyFormSchema>

export const AGE_GROUPS = ['30대', '40대', '50대', '60대', '70대 이상'] as const

export const INTERESTS = [
  '스마트폰 활용 (사진, 카톡, 앱 사용법)',
  '챗GPT 사용법',
  '클로드(Claude) 사용법',
  'AI로 그림 그리기',
  'AI로 영상 만들기',
  'AI 기초 (AI가 뭔지부터 알고 싶어요)',
  '유튜브·SNS 활용법',
  'AI 활용 자격증(강사과정)',
  '잘 모르겠어요, 상담받고 싶어요',
  '기타',
] as const

export const TIME_SLOTS = ['오전', '저녁', '주말', '직접 입력'] as const

export const SOURCES = ['블로그', '지인추천', '현수막', '기타'] as const
