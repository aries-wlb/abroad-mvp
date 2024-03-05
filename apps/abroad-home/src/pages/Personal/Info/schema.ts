import { DefaultAcademic } from '@/constants'
import type { UserInfo } from '@/services/model'
import { generateLabelMap } from '@/shared'

export const labelMap = generateLabelMap({
  school_name: 'School Attended',
  major: 'Major Attended',
  language_achi: 'Language Achievement',
  academic_experience: 'Other Standardized Achievement',
  // language_achi: 'Academic achievements',
  intent_region: 'Regional Intention',
  name: 'Name',
  achi: 'Achievement',
  intent_major: 'Intended Major',
  other_details: 'Other',
  language_score: 'Language Score',
  language_type: 'Language Type',
  degree: 'Degree',

  account_name: 'Account Name',
  user_name: 'Name',
  gender: 'Gender',
  school_type: 'School Type',
  gpa: 'GPA',
  location: 'Location',
  phone_number: 'Phone Number',
  wechat_id: 'Wechat ID',
  email: 'Email',
  personal_introduction: 'Personal Introduction',
})

export const formItems = [
  {
    type: 'Input',
    name: 'account_name',
    label: labelMap.account_name.full,
    required: true,
  },
  {
    type: 'Input',
    name: 'user_name',
    label: labelMap.user_name.full,
  },
  {
    type: 'Radio',
    name: 'gender',
    label: labelMap.gender.full,
    initialValue: 'male',
    options: [
      { label: 'male', value: 'male' },
      { label: 'female', value: 'female' },
    ],
  },
  {
    type: 'Input',
    name: 'school_name',
    label: labelMap.school_name.full,
  },
  {
    type: 'Radio',
    name: 'degree',
    label: labelMap.degree.full,
    required: true,
    optionKey: 'degrees',
    initialValue: 0,
    options: [],
    handleChange: 'onDegreeChange',
  },
  {
    type: 'Select',
    name: 'school_type',
    label: labelMap.school_type.full,
    required: true,
    optionKey: 'school_types',
    options: [],
  },
  {
    type: 'Input',
    name: 'major',
    label: labelMap.major.full,
  },
  {
    type: 'InputNumber',
    name: 'gpa',
    tips: 'You should input the percentage of your GPA relative to the total GPA of your school e.g. 80%',
    label: labelMap.gpa.full,
    precision: 1,
    max: 100,
    min: 0,
    addonAfter: '%',
  },
  {
    type: 'Input',
    name: 'location',
    label: labelMap.location.full,
  },
  {
    type: 'Input',
    name: 'phone_number',
    label: labelMap.phone_number.full,
  },
  {
    type: 'Input',
    name: 'wechat_id',
    label: labelMap.wechat_id.full,
  },
  {
    type: 'Input',
    name: 'email',
    label: labelMap.email.full,
  },
  {
    type: 'MultiForm',
    name: 'language_achi',
    label: labelMap.language_achi.full,
    children: [
      {
        type: 'Select',
        name: 'name',
        placeholder: 'Name',
        options: [
          { label: 'IELTS', value: 'IELTS' },
          { label: 'TOEFL', value: 'TOEFL' },
        ],
      },
      {
        type: 'InputNumber',
        placeholder: 'Score',
        name: 'achievement',
        max: 120,
        min: 0,
        precision: 1,
      },
    ],
  },
  {
    type: 'FormList',
    name: 'academic_experience',
    children: [
      {
        type: 'Select',
        name: 'name',
        placeholder: 'Name',
        options: [...DefaultAcademic],
      },
      {
        type: 'InputNumber',
        placeholder: 'score',
        name: 'achievement',
        // required: true,
      },
    ],
    label: labelMap.academic_experience.full,
  },
  {
    type: 'Select',
    name: 'intent_region',
    label: labelMap.intent_region.full,
    options: [
      { label: 'US', value: 'US' },
      { label: 'UK', value: 'UK' },
      { label: 'HK', value: 'HK' },
      { label: 'AUS', value: 'AUS' },
    ],
  },
  {
    type: 'Input',
    name: 'intent_major',
    label: labelMap.intent_major.full,
  },
  {
    type: 'TextArea',
    name: 'personal_introduction',
    label: labelMap.personal_introduction.full,
  },
  {
    type: 'TextArea',
    name: 'other_details',
    label: labelMap.other_details.full,
  },
]

export type BaseInfoKeys = keyof Omit<UserInfo, 'academic_experience'>
export interface BaseInfoItem {
  label: string
  name: BaseInfoKeys
}
export const baseInfo: Array<BaseInfoItem> = (
  [
    'user_name',
    'gender',
    'school_name',
    'degree',
    'school_type',
    'major',
    'gpa',
    'language_type',
    'language_score',
    'location',
    'phone_number',
    'wechat_id',
    'email',
  ] as Array<BaseInfoKeys>
).map(key => ({
  label: labelMap[key].full,
  name: key,
}))
