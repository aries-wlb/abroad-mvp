import { httpV1 } from '../http'
import type {
  UpdateArticleRequset,
  UpdateUserByAdminRequset,
  UsersResponse,
} from '../model'

const { get, post } = httpV1

export function getUsers(current: number, pageSize: number, role_id: number) {
  return get<UsersResponse>('/admin/getUsers', {
    current,
    page_size: pageSize,
    role_id,
  })
}

export function getStudents(current: number, pageSize: number) {
  return get<UsersResponse>('/admin/getStudents', {
    current,
    page_size: pageSize,
  })
}

export function updateUserByAdmin(userInfo: UpdateUserByAdminRequset) {
  return post('/admin/updateUser', { ...userInfo })
}

export function addArticle(article: UpdateArticleRequset) {
  return post('/admin/addArticle', { ...article })
}

export function deleteArticle(articleId: number) {
  return post('/admin/deleteArticle', { article_id: articleId })
}

export function updateArticle(article: UpdateArticleRequset) {
  return post('/admin/updateArticle', { ...article })
}
