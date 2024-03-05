import { useMemoizedFn } from 'ahooks'
import { useMemo, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { ValidateStatus } from 'antd/es/form/FormItem'
import { Modal } from '@/components'
import { useGlobalStore } from '@/store'
import type { LoginRequest, RegisterRequest } from '@/services/model'
import { ResponseCode } from '@/constants'
import { checkAccount } from '@/services/api'

const Action = {
  Login: 'Login',
  Register: 'Register',
}

const LoginModal: React.FC = () => {
  const navigate = useNavigate()
  const globalStore = useGlobalStore(state => ({
    open: state.loginOpen,
    setOpen: state.setOpen,
    next: state.next,
    login: state.login,
    loginLoading: state.loginLoading,
    registerLoading: state.registerLoading,
    register: state.register,
  }))
  const [accountValidInfo, setAccountValidInfo] = useState<{
    status?: ValidateStatus
    message?: string
  }>({ status: '', message: '' })
  const [form] = Form.useForm()
  const [formSetting, setFormSetting] = useState<{
    submitText: string
    action: string
    footerText?: string
    footerBtnText?: string
  }>({
    submitText: 'Sign In',
    action: Action.Login,
    footerText: 'Don’t have an account?',
    footerBtnText: 'Sign Up',
  })

  const handleCloseModal = useMemoizedFn(() => {
    form.resetFields()
    setAccountValidInfo({ status: undefined, message: undefined })

    globalStore.setOpen(false)
  })

  const switchForm = useMemoizedFn((action: string, initValue?: any) => {
    form.resetFields()
    setAccountValidInfo({ status: '', message: '' })
    switch (action) {
      case Action.Login:
        setFormSetting({
          submitText: 'Sign In',
          action,
          footerText: 'Don’t have an account?',
          footerBtnText: 'Sign Up',
        })
        if (initValue) form.setFieldValue('account', initValue?.account)

        break
      case Action.Register:
        setFormSetting({
          submitText: 'Sign Up',
          action,
          footerText: 'Already have an account?',
          footerBtnText: 'Sign In',
        })
        break
      default:
        break
    }
  })

  const handleSubmit = useMemoizedFn(async data => {
    let result: number | boolean
    const { confirm: _confirm, ...rest } = data
    switch (formSetting.action) {
      case Action.Login:
        result = await globalStore.login(rest as LoginRequest)
        if (!result) return
        handleCloseModal()
        if (!globalStore.next) return
        navigate(globalStore.next)
        break
      case Action.Register:
        result = await globalStore.register(rest as RegisterRequest)
        if (result !== ResponseCode.SUCCESS) {
          if (result === ResponseCode.ERROR_EXISTED) {
            setAccountValidInfo({
              status: 'error',
              message: 'Account already exists',
            })
          }

          return
        }
        form.setFieldValue('account', rest.account)
        switchForm(Action.Login, { account: rest.account })
        break
      default:
        break
    }
  })

  const handleAccountBlur = useMemoizedFn(async () => {
    const account = form.getFieldValue('account')
    if (!account) {
      setAccountValidInfo({ status: undefined, message: undefined })
      return
    }
    setAccountValidInfo({ status: 'validating', message: '' })
    const result = await checkAccount(account)
    const { code, msg, data } = result
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Check failed: ${msg}`)
      return
    }
    if (data.exist) {
      setAccountValidInfo({
        status: 'error',
        message: 'Account already exists',
      })
      return
    }

    setAccountValidInfo({ status: 'success', message: '' })
  })

  const submitLoading = useMemo(
    () =>
      formSetting.action === Action.Login
        ? globalStore.loginLoading
        : globalStore.registerLoading,
    [globalStore.loginLoading, globalStore.registerLoading, formSetting.action]
  )

  const renderLogin = useMemoizedFn(() => {
    return (
      <>
        <Form.Item
          label="Account"
          name="account"
          required
          rules={[{ required: true }]}
        >
          <Input placeholder="Input Account" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="Input Password" />
        </Form.Item>
      </>
    )
  })

  const renderRegister = useMemoizedFn(() => {
    return (
      <>
        <Form.Item
          label="Account"
          name="account"
          required
          validateStatus={accountValidInfo.status}
          help={accountValidInfo.message}
          hasFeedback
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Input Account"
            onBlur={handleAccountBlur}
            autoComplete="new-password"
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          required
          rules={[{ required: true }]}
        >
          <Input.Password
            placeholder="Input Password"
            autoComplete="new-password"
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value)
                  return Promise.resolve()

                return Promise.reject(
                  new Error('The new password that you entered do not match!')
                )
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Double Confirm Password"
            autoComplete="new-password"
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="Account Name"
          name="account_name"
          required
          rules={[{ required: true }]}
        >
          <Input placeholder="Input Account Name" />
        </Form.Item>
        <Form.Item label="Phone Number" name="phone_number">
          <Input placeholder="Input Phone Number" />
        </Form.Item>
      </>
    )
  })

  const renderRegisterFooter = useMemoizedFn(() => {
    return (
      <div className="flex justify-center items-center">
        <span style={{ color: 'rgb(91 112 150)' }}>
          {formSetting.footerText}
        </span>
        <span
          className="ml-1 cursor-pointer"
          onClick={() =>
            switchForm(
              formSetting.action === Action.Login
                ? Action.Register
                : Action.Login
            )
          }
        >
          {formSetting.footerBtnText}
        </span>
      </div>
    )
  })

  return (
    <Modal
      open={globalStore.open}
      title={formSetting.action}
      destroyOnClose
      onCancel={handleCloseModal}
      width="400px"
      closeIcon={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={formSetting.action === Action.Register}
      >
        {formSetting.action === Action.Login ? renderLogin() : renderRegister()}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitLoading}
            style={{ width: '100%' }}
          >
            {formSetting.submitText}
          </Button>
        </Form.Item>
      </Form>
      {renderRegisterFooter()}
    </Modal>
  )
}
export default LoginModal
