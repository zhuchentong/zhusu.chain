import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AuthService } from 'app/utils/auth.service'
import { LoggerService } from '@ngx-toolkit/logger'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // 对应错误码处理函数
  private readonly errorHandlerMapping = {
    401: this.unauthorizedErrorHandle
  }

  constructor(
    private authService: AuthService,
    private logger: LoggerService
  ) {}

  /**
   * 网络异常拦截器
   * @param request
   * @param next
   */
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        // 获取对应错误处理函数
        const errorHandler = (
          this.errorHandlerMapping[err.status] || this.defaultErrorHandle
        ).bind(this)
        // 获取错误处理返回结果
        const error = errorHandler(err)
        this.logger.error(err)
        return throwError(error || err.message || err.statusText)
      })
    )
  }

  /**
   * 未认证异常处理
   */
  private unauthorizedErrorHandle(err) {
    this.authService.logout()
  }

  /**
   * 默认异常处理
   */
  private defaultErrorHandle(err) {
    return
  }
}
