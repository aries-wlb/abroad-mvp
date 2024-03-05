import { DefaultAcademic } from '@/constants'
import type { Application, UserInfo } from '@/services/model'
import { Role } from '@/services/model/admin'
import { generateLabelMap } from '@/shared'

export const labelMap = generateLabelMap({
  account: 'Account',
  user_id: 'User ID',
  avatar_url: 'Avatar Url',
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
  applications: 'Application',

  created_at: 'Created At',
  last_login: 'Last Login',
  edit: 'Edit',
  options: 'Options',
  role_id: 'Role',
})

export const formItems = [
  {
    type: 'Input',
    name: 'user_id',
    // label: labelMap.account_name.full,
    // required: true,
    hidden: true,
  },
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
        max: 100,
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
  {
    type: 'Select',
    name: 'role_id',
    label: labelMap.role_id.full,
    required: true,
    options: [
      { label: 'Admin', value: Role.Admin },
      { label: 'Student', value: Role.Student },
      { label: 'Intermediary', value: Role.Intermediary },
    ],
  },
]

export const tableColumns = [
  'user_name',
  'account_name',
  'gender',
  'school_name',
  'phone_number',
  'applications',
  'created_at',
  'last_login',
  'options',
].map(name => {
  let extra = {}
  if (name === 'user_name') {
    extra = {
      ...extra,
      type: 'Link',
      handle: 'clickUser',
    }
  }
  if (name === 'applications') {
    extra = {
      ...extra,
      render: (_: Application, record: UserInfo) => {
        return record.applications?.length || 0
      },
    }
  }
  if (name === 'options') {
    extra = {
      ...extra,
      type: 'Action',
      config: [
        {
          label: labelMap.edit.short,
          type: 'link',
          handle: 'clickEdit',
        },
      ],
    }
  }

  if (['last_login', 'created_at'].includes(name)) {
    extra = {
      ...extra,
      type: 'Datetime',
    }
  }

  return {
    label: labelMap[name].short,
    name,
    ...extra,
  }
})
