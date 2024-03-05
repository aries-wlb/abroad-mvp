import { ApplicationStatus } from '@/services/model'
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
  user_id: 'User ID',

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
    type: 'Select',
    name: 'user_id',
    label: labelMap.user_id.full,
    required: true,
    placeholder: 'Please select a user',
    optionKey: 'student',
    options: [],
  },
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
    type: 'Select',
    name: 'status',
    label: labelMap.status.full,
    required: true,
    options: [
      { label: 'Prepare Document', value: ApplicationStatus.PrepareDocument },
      { label: 'Prepare DDL', value: ApplicationStatus.PrepareDDL },
      { label: 'Prepare Submit', value: ApplicationStatus.PrepareSubmit },
      { label: 'Submit Fee', value: ApplicationStatus.SubmitFee },
      { label: 'Submit Ref Letter', value: ApplicationStatus.SubmitRefLetter },
      { label: 'Offer Waiting', value: ApplicationStatus.OfferWaiting },
      {
        label: 'Admission Document',
        value: ApplicationStatus.AdmissionDocument,
      },
      { label: 'Admission Deposit', value: ApplicationStatus.AdmissionDeposit },
      { label: 'Done', value: ApplicationStatus.Done },
    ],
  },
  {
    type: 'Radio',
    name: 'type',
    label: labelMap.type.full,
    required: true,
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
      render: (_text: string, record: any) => {
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
