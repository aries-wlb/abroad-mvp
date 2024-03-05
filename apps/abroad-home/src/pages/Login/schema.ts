import { generateLabelMap } from '@/shared'

export const labelMap = generateLabelMap({
  id: 'ID',
  school: 'School',
  major: 'Major',
  files: 'documents',
  ddl: 'DDL',
  action: 'Action',
  progress: 'Progress',
  options: 'Options',
  edit: 'Edit',
  type: 'Type',
})

export const loginFormItems = [
  {
    type: 'Input',
    name: 'school',
    label: labelMap.school.full,
    required: true,
  },
  {
    type: 'Input',
    name: 'major',
    label: labelMap.major.full,
    required: true,
  },
  {
    type: 'Upload',
    name: 'files',
    label: labelMap.files.full,
    required: true,
  },
  {
    type: 'DatePicker',
    name: 'ddl',
    label: labelMap.ddl.full,
    required: true,
  },
  {
    type: 'Radio',
    name: 'action',
    label: labelMap.action.full,
    required: true,
    initialValue: 'self',
    options: [
      { label: 'Self-Apply', value: 'self' },
      { label: 'Auto-Apply', value: 'auto' },
    ],
  },
]

export const registerFormItems = [
  {
    type: 'Input',
    name: 'school',
    label: labelMap.school.full,
    required: true,
  },
  {
    type: 'Input',
    name: 'major',
    label: labelMap.major.full,
    required: true,
  },
  {
    type: 'Upload',
    name: 'files',
    label: labelMap.files.full,
    required: true,
  },
  {
    type: 'DatePicker',
    name: 'ddl',
    label: labelMap.ddl.full,
    required: true,
  },
  {
    type: 'Radio',
    name: 'action',
    label: labelMap.action.full,
    required: true,
    initialValue: 'self',
    options: [
      { label: 'Self-Apply', value: 'self' },
      { label: 'Auto-Apply', value: 'auto' },
    ],
  },
]
