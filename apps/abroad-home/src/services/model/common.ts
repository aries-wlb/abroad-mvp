import type { AcademicExperience, UserInfo } from './user'

export interface RegisterRequest {
  phone_number: string
  account_name: string
  account: string
  password: string
  role_id: number
}

export interface LoginRequest {
  account: string
  password: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}

export interface MatchRequest {
  school_name?: string
  school_type: string
  degree: number
  major?: string
  gpa: number
  language_achi?: AcademicExperience
  academic_experience?: Array<AcademicExperience>
  intent_region?: string
  intent_major?: string
  other_details?: string
  toefl?: number
  ielts?: number
  gmat?: number
  gre?: number
  act?: number
  sat?: number
  ap?: number
  a_level?: number
  ib?: number
}

export interface MatchResponse {
  result_code?: number
  result_msg?: string
}

export interface CheckAccountResponse {
  exist: boolean
}

export type OptionKey = 'school_types' | 'degrees'

export type OptionResponse = Record<OptionKey, Option[]>

export interface Option {
  label: string
  value: number | string
  degree?: number
}
