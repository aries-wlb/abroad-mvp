import { generateLabelMap } from '@/shared'

export const labelMap = generateLabelMap({
  application_id: 'ID',
  school: 'School',
  major: 'Major',
  files: 'documents',
  ddl: 'DDL',
  action: 'Action',
  status: 'Progress',
  options: 'Options',
  edit: 'Edit',
  type: 'Type',

  user_name: 'Name',
  gender: 'Gender',
  school_type: 'School Type',
  gpa: 'GPA',
  languageAchi: 'Language Achievement',
  location: 'Location',
  phone_number: 'Phone Number',
  wechat_id: 'Wechat ID',
  email: 'Email',
  delete: 'Delete',
})

export const formItems = [
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
    maxCount: 1,
    // handle: 'uploadRequest',
    // required: true,
  },
  {
    type: 'DatePicker',
    name: 'ddl',
    label: labelMap.ddl.full,
    required: true,
  },
  {
    type: 'Radio',
    name: 'type',
    label: labelMap.type.full,
    required: true,
    disabledUpdate: true,
    initialValue: 'self',
    options: [
      { label: 'Self-Apply', value: 'self' },
      { label: 'Auto-Apply', value: 'auto' },
    ],
  },
]

function getProgressText(progress: number) {
  switch (progress) {
    case 1:
    case 2:
    case 3:
      return 'Preparing'
    case 4:
    case 5:
      return 'Submitted'
    case 6:
      return 'Waiting'
    case 7:
    case 8:
      return 'Admitted'
    case 9:
      return 'Done'
    default:
      return 'Error'
  }
}
export const tableColumns = [
  'school',
  'major',
  'ddl',
  'status',
  'type',
  'options',
].map(name => {
  let extra = {}
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
        {
          type: 'divider',
        },
        {
          label: labelMap.delete.short,
          type: 'link',
          handle: 'clickDelete',
          withConfirm: true,
          confirmTitle: 'Delete Confirm',
          confirmContent: 'Are you sure to delete this application?',
        },
      ],
    }
  }

  if (name === 'status') {
    extra = {
      ...extra,
      type: 'Link',
      handle: 'clickProgress',
      linkRender: (_text: string, record: any) => {
        return getProgressText(record.status)
      },
    }
  }
  return {
    label: labelMap[name].short,
    name,
    ...extra,
  }
})
