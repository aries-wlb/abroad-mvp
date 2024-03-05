import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { formItems } from './schema'
import { Form } from '@/components'
import type {
  Application,
  File,
  UpdateApplicationRequest,
} from '@/services/model'
import { ACTION } from '@/constants'
import { useApplicationStore } from '@/store'

interface Props {
  data?: Application
  action: string
  onSubmit?: () => void
}

type FormData = Omit<UpdateApplicationRequest, 'ddl' | 'file_ids'> & {
  ddl: Dayjs
  files: File[]
}

const CreateForm: React.FC<Props> = ({ data, action, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({} as FormData)
  const [formSchema, setFormScema] = useState(formItems)
  const { createApp, updateApp, loading } = useApplicationStore(state => ({
    loading: state.updating,
    createApp: state.createApplicationByUser,
    updateApp: state.updateApplicationByUser,
  }))
  const _onSubmit = useMemoizedFn(async (fields: FormData) => {
    const reqParams = {
      application_id: data?.application_id,
      school: fields.school,
      major: fields.major,
      ddl: Math.floor(fields.ddl.toDate().getTime() / 1000),
      file_ids: fields.files.map(file => file.file_id),
    }
    switch (action) {
      case ACTION.Add:
        await createApp({ ...reqParams, type: fields.type })
        break
      case ACTION.Edit:
        await updateApp(reqParams)
        break
      default:
        break
    }

    onSubmit?.()
  })

  useEffect(() => {
    if (action === ACTION.Edit) {
      setFormScema(
        formSchema.map(item => {
          const { disabledUpdate, ...rest } = item
          if (disabledUpdate) return { ...rest, disabled: true }

          return { ...rest }
        }) as any
      )
    } else {
      setFormScema(
        formSchema.map(item => ({
          ...item,
          disabled: false,
        }))
      )
    }
  }, [action])

  useEffect(() => {
    if (action !== ACTION.Edit || !data) return
    setFormData({
      school: data.school,
      major: data.major,
      ddl: dayjs(new Date(data.ddl).getTime()),
      files: data.files.map(file => ({
        ...file,
        name: file.file_name,
        uid: file.file_id,
        url: file.file_url,
        status: 'done',
      })),
    })
  }, [data])

  return (
    <div className="create-form">
      <Form
        schema={formSchema}
        data={formData}
        onSubmit={_onSubmit}
        captions={{ submit: 'Apply' }}
        customFormButtonProps={{ submit: { loading } }}
      />
    </div>
  )
}

export default CreateForm
