import { generateLabelMap } from '@/shared'

export const labelMap = generateLabelMap({
  article_id: 'Article Id',
  article_url: 'Article Url',
  author: 'Author',
  content: 'Content',
  title: 'Title',
  edit: 'Edit',
  options: 'Options',
  delete: 'Delete',
})

export const formItems = [
  {
    type: 'Input',
    name: 'article_id',
    // label: labelMap.account_name.full,
    // required: true,
    hidden: true,
  },
  {
    type: 'Input',
    name: 'title',
    label: labelMap.title.full,
    required: true,
    placeholder: 'Please input title',
  },
  {
    type: 'Input',
    name: 'content',
    label: labelMap.content.full,
    required: true,
    placeholder: 'Please input content',
  },
  {
    type: 'Input',
    name: 'author',
    label: labelMap.author.full,
    placeholder: 'Please input author',
  },
  {
    type: 'Input',
    name: 'article_url',
    label: labelMap.article_url.full,
    placeholder: 'Please input article url',
  },
]

export const tableColumns = [
  'article_id',
  'article_url',
  'author',
  'content',
  'title',
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
          confirmContent: 'Are you sure to delete this article?',
        },
      ],
    }
  }

  // if (['last_login', 'created_at'].includes(name)) {
  //   extra = {
  //     ...extra,
  //     type: 'Datetime',
  //   }
  // }

  return {
    label: labelMap[name].short,
    name,
    ...extra,
  }
})
