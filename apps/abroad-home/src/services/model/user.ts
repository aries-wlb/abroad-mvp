import type { Application } from './application'

export interface AcademicExperience {
  name: string
  achievement: number
}

export type UserInfo = UserBase & {
  user_id: number
  gpa: number
  school_name: string
  school_type: string
  major: string
  degree: number
  language_achi: AcademicExperience
  language_type: string
  language_score: number
  academic_experience: Array<AcademicExperience>
  intent_region: string
  intent_major: string
  other_details: string
  user_name: string
  avatar_url: string
  gender: string
  location: string
  wechat_id: string
  email: string
  personal_introduction: string
  created_at: string
  last_login: string
  applications?: Application[]
}

export interface UserBase {
  accout: string
  account_name: string
  pasword: string
  phone_number: string
  role_id: number
}

export interface UserResponse {
  user_info: UserInfo
}

export interface UpdateUserRequset {
  user_name: string
  account_name: string
  email: string
  phone_number: string
  degree: number
  wechat_id: string
  location: string
  school_name: string
  school_type: string
  major: string
  gpa: number
  language_achi: AcademicExperience
  academic_experience: Array<AcademicExperience>
  intent_region: string
  intent_major: string
  other_details: string
  personal_introduction: string
  gender: string
}
