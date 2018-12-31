import { environment } from '../../environments/environment'

export const appConfig = {
  name: '',
  version: '',
  server: environment.url.server,
  timeout: 99999 // 超时时间
}
