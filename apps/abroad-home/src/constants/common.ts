export const ACTION = {
  Add: 'add',
  Edit: 'edit',
}

export type PaginationType = typeof Pagination

export const Pagination = {
  total: 0,
  current: 1,
  pageSize: 25,
  showSizeChanger: true,
  pageSizeOptions: ['25', '50', '100', '200'],
}

export const DefaultAcademic = [
  { label: 'GRE', value: 'GRE' },
  { label: 'GMAT', value: 'GMAT' },
  { label: 'SAT1', value: 'SAT' },
  { label: 'ACT', value: 'ACT' },
  { label: 'AP', value: 'AP' },
  { label: 'A-Level', value: 'ALevel' },
  { label: 'IB', value: 'IB' },
]
