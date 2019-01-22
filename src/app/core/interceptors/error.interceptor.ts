import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpClient
} from '@angular/common/http'
import { Observable, throwError, EmptyError, EMPTY, observable } from 'rxjs'
import { catchError, retry, retryWhen, tap } from 'rxjs/operators'
import { LoggerService } from '@ngx-toolkit/logger'
import { Store } from '@ngxs/store'
import {
  LogoutAction,
  LoginAction,
  UpdateUserAction
} from 'app/store/action/user.action'
import { CommonService } from 'app/utils/common.service'
import { UserService } from 'app/services/user.service'
import { UserState } from 'app/store/state/user.state'
import { appConfig } from 'app/config/app.config'
import { plainToClass } from 'class-transformer'
import { User } from 'app/models/user.model'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // 对应错误码处理函数
  private readonly errorHandlerMapping = {
    401: this.unauthorizedErrorHandle,
    500: this.ServerErrorHandle
  }

  constructor(
    private userService: UserService,
    private commonService: CommonService,
    private store: Store,
    private logger: LoggerService,
    private http: HttpClient
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
      }),
      retryWhen(errors =>
        Observable.create(observer => {
          errors.pipe(catchError(observer.error)).subscribe(error => {
            if (
              error.user &&
              error.user.accessToken &&
              error.user.refreshToken
            ) {
              const body = new URLSearchParams()
              body.set('grant_type', 'refresh_token')
              body.set('refresh_token', error.user.refreshToken)
              this.http
                .post(
                  `${appConfig.server}/oauth/access_token`,
                  body.toString(),
                  {
                    headers: new HttpHeaders().set(
                      'Content-Type',
                      'application/x-www-form-urlencoded'
                    )
                  }
                )
                .subscribe(response => {
                  this.store.dispatch(
                    new UpdateUserAction(plainToClass(User, response))
                  )
                })
            }
          })
        })
      )
    )
  }

  /**
   * 未认证异常处理
   */
  private unauthorizedErrorHandle(err) {
    const user = this.store.selectSnapshot(UserState.getUser)
    this.store.dispatch(LogoutAction)
    return {
      status: err.status,
      message: '用户认证失败',
      user
    }
  }

  /**
   * 500异常处理
   * @param err
   */
  private ServerErrorHandle(err) {
    return
  }

  /**
   * 默认异常处理
   */
  private defaultErrorHandle(err) {
    return
  }
}
