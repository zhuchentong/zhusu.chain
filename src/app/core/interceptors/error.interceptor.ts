import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpClient
} from '@angular/common/http'
import {
  Observable,
  throwError,
  EmptyError,
  EMPTY,
  observable,
  Observer
} from 'rxjs'
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
    4013: this.forbiddenErrorHandle,
    500: this.serverErrorHandle
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
      catchError(error => {
        // 获取对应错误处理函数
        const errorHandler = (
          this.errorHandlerMapping[error.status] || this.defaultErrorHandle
        ).bind(this)
        // 获取错误处理返回结果
        const result = errorHandler(error)
        this.logger.error(result)
        return throwError(result || error.message || error.statusText)
      }),
      // 通讯异常重试
      retryWhen(errors =>
        Observable.create(observer => {
          errors.pipe(catchError(observer.error)).subscribe(error => {
            // accessToken过期,则通过refreshToken更新
            if (
              error.status === 401 &&
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
                  // 修正异常状态
                  observer.complete()
                })
            } else {
              // 恢复异常状态
              observer.error(error)
            }
          })
        })
      )
    )
  }

  /**
   * 401异常处理
   */
  private unauthorizedErrorHandle(error) {
    const user = this.store.selectSnapshot(UserState.getUser)
    this.store.dispatch(LogoutAction)
    return Object.assign(error, {
      status: error.status,
      message: '用户认证失败',
      user
    })
  }

  /**
   * 500异常处理
   * @param error
   */
  private serverErrorHandle(error) {
    return error
  }

  /**
   * 403异常处理
   * @param error
   */
  private forbiddenErrorHandle(error) {
    return error
  }

  /**
   * 默认异常处理
   */
  private defaultErrorHandle(error) {
    return error
  }
}
