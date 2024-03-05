import { DefaultAcademic } from '@/constants'
import { generateLabelMap } from '@/shared'

export const labelMap = generateLabelMap({
  school_name: 'School Attended',
  school_type: 'Type',
  major: 'Major Attended',
  gpa: 'GPA',
  degree: 'Degree',
  language_achi: 'Language Achievement',
  academic_experience: 'Other Standardized Achievement',
  // language_achi: 'Academic achievements',
  intent_region: 'Regional Intention',
  name: 'Name',
  achi: 'Achievement',
  intent_major: 'Intended Major',
  other_details: 'Other',
})

export const detailKeys = [
  'school_name',
  'school_type',
  'major',
  'gpa',
  'language_achi',
  'academic_experience',
  'intent_region',
  'intent_major',
  'other_details',
]

export const formItems = [
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
    required: true,
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
    tips: 'For AP, you need  input the total score for AP courses that are above 4 points.\n For A-Level exams, an A is worth 3 points, and a B is worth 2 points. Please calculate the total scores for the top three exams that are above a B',
    children: [
      {
        type: 'Select',
        name: 'name',
        placeholder: 'Name',
        options: [...DefaultAcademic],
      },
      {
        type: 'InputNumber',
        placeholder: 'Score',
        name: 'achievement',
        // required: true,
      },
    ],
    label: labelMap.academic_experience.full,
  },
  {
    type: 'Select',
    name: 'intent_region',
    required: true,
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
    name: 'other_details',
    label: labelMap.other_details.full,
  },
]
