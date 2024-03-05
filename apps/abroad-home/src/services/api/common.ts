import { httpV1 } from '../http'
import type {
  CheckAccountResponse,
  LoginRequest,
  LoginResponse,
  MatchRequest,
  MatchResponse,
  OptionResponse,
  RegisterRequest,
} from '../model'

const { post, get } = httpV1

export function login(data: LoginRequest) {
  return post<LoginResponse>('/login', { ...data })
}

export function register(data: RegisterRequest) {
  return post('/register', { ...data })
}

export function match(data: MatchRequest) {
  return post<MatchResponse>('/match', { ...data })
}

export function getOptions() {
  return get<OptionResponse>('/getOptions')
}

export function checkAccount(account: string) {
  return post<CheckAccountResponse>('/checkAccount', { account })
}
