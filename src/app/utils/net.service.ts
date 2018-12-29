
import { Injectable } from '@angular/core';
import { Observable, throwError } from "rxjs"
import { map, catchError } from 'rxjs/operators';
import { appConfig } from '../config/app.config'
import { HttpClient, HttpRequest, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
// import { ServerConfig } from 'app/config/service'

@Injectable({
  providedIn: 'root',
})
export class NetService {
  private headers = new HttpHeaders()

  constructor(
    private http: HttpClient
  ) {
    // TODO:获取jwt&token
  }

  /**
   * 根据服务配置生成通讯地地址
   * @param options
   */
  private generateRequestUrl(options: any, append: Array<String> = []): string {
    return [
      appConfig.server,
      'api',
      options.controller,
      options.action,
      ...append].filter(x => x).join('/')
  }

  /**
   * 根据服务配置返回Search参数
   * @param options
   */
  private generateRequestParams(options): HttpParams {
    if (['GET', 'DELETE'].includes(options.service.method)) {
      // TODO:分页处理
      return new HttpParams({
        fromObject: options.params
      })
    } else {
      return null
    }
  }

  /**
   * 根据服务配置返回Body参数
   * @param options
   */
  private generateRequestBody(options): object {
    if (['POST', 'PUT'].includes(options.service.method)) {
      // TODO:分页处理
      return options.params
    } else {
      return null
    }
  }

  /**
   * 生成头部信息
   */
  private generateRequestHeader(optons): HttpHeaders {
    // TODO:自定义header
    return this.headers
  }

  /**
   * 发送网络通讯请求
   * @param options
   */
  send(options: any): Observable<any> {
    const requestUrl: string = this.generateRequestUrl(options.service, options.append)
    const requestMethod: string = options.service.method
    const requestBody = this.generateRequestBody(options)

    // 生车通讯观察对象
    const observable = Observable.create((observer) => {
      this.http.request(
        requestMethod,
        requestUrl,
        {
          body: this.generateRequestBody(options),
          headers: this.generateRequestHeader(options),
          observe: "response",
          responseType: 'json',
          params: this.generateRequestParams(options)
        }
      ).
        pipe(
          map(response => response.body),
          catchError(response => {
            try {
              // 获取错误信息
              let error = {
              }
              // 验证错误类型
              if (Object.values(error).some(x => x !== null || x !== undefined)) {
                observer.error(error)
              }
              return throwError(response)
            } catch (ex) {
              return throwError("网络通讯异常")
            }
          })
        )
        .subscribe((data: any) => {
          // TODO:判断是否开启分页
          observer.next(data)
        })
    });

    return observable
  }
}
