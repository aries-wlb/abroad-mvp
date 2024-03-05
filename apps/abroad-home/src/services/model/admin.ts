import type { AcademicExperience, UserInfo } from './user'

export interface UpdateUserByAdminRequset {
  user_id: number
  role_id: number
  user_name: string
  account_name: string
  email: string
  phone_number: string
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

export interface UsersResponse {
  current: number
  page_size: number
  total: number
  list: Array<UserInfo>
}

export interface UpdateArticleRequset {
  article_id?: number
  title: string
  article_url: string
  content: string
  author: string
}

export interface DeleteArticleRequset {
  article_id: number
}

export enum Role {
  Admin = 1,
  Student = 2,
  Intermediary = 3,
}
