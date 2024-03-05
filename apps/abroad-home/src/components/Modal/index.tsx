import type { ModalProps } from 'antd'
import { Modal as _Modal } from 'antd'

type ModalComponentProps = {
  children: any
  height?: string | number
  maxHeight?: string | number
} & ModalProps

export function Modal({
  children,
  width = '80%',
  height = '100%',
  maxHeight = '70vh',
  footer = null,
  ...rest
}: ModalComponentProps) {
  return (
    <_Modal
      width={width}
      bodyStyle={{
        height,
        maxHeight,
        overflowY: 'scroll',
      }}
      centered
      footer={footer}
      {...rest}
    >
      {children}
    </_Modal>
  )
}
