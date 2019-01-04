import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { map, finalize } from 'rxjs/operators'
import { appConfig } from 'app/config/app.config'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { LoadingController } from '@ionic/angular'
import { Model } from 'app/models'
import { classToPlain, plainToClass } from 'class-transformer'

interface IReqestService {
  controller?: string
  action?: string
  method: string
}

interface IRequestOption {
  service: IReqestService
  append?: string[]
  loading?: boolean | string
  model?: any
  params?: any
}

@Injectable({
  providedIn: 'root'
})
export class NetService {
  private headers = new HttpHeaders()
  private loading: HTMLIonLoadingElement
  private readonly defaultLoadingMessage = ''
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {}

  /**
   * 发送网络通讯请求
   * @param options
   */
  public send(options: IRequestOption): Observable<any> {
    // 请求Url
    const requestUrl: string = this.generateRequestUrl(
      options.service,
      options.append
    )
    // 请求Method
    const requestMethod: string = options.service.method
    this.generateRequestLoading(options)
    return this.http
      .request(requestMethod, requestUrl, {
        body: this.generateRequestBody(options),
        headers: this.generateRequestHeader(options),
        observe: 'response',
        responseType: 'json',
        params: this.generateRequestParams(options)
      })
      .pipe(
        // 取body数据
        map(response => {
          return options.model
            ? plainToClass(options.model, response.body)
            : response.body
        }),
        finalize(() => {
          if (options.loading && this.loading) {
            this.loading.dismiss()
          }
        })
      )
    // TODO:对数据分页进行处理
  }

  /**
   * 根据服务配置生成通讯地地址
   * @param options
   */
  private generateRequestUrl(options: any, append: string[] = []): string {
    return [
      appConfig.server,
      'api',
      options.controller,
      options.action,
      ...append
    ]
      .filter(x => x)
      .join('/')
  }

  /**
   * 根据服务配置返回Search参数
   * @param options
   */
  private generateRequestParams(options): HttpParams {
    if (!['GET', 'DELETE'].includes(options.service.method)) {
      return null
    }

    // TODO:分页处理
    let params = options.params

    if (options.params instanceof Model) {
      params = classToPlain(options.params)
    }
    return new HttpParams({
      fromObject: params
    })
  }

  /**
   * 根据服务配置返回Body参数
   * @param options
   */
  private generateRequestBody(options): object {
    if (!['POST', 'PUT'].includes(options.service.method)) {
      return null
    }

    // 如果参数继承Model
    if (options.params instanceof Model) {
      return classToPlain(options.params)
    }
    // TODO:分页处理
    return options.params
  }

  /**
   * 生成头部信息
   */
  private generateRequestHeader(options): HttpHeaders {
    // TODO:自定义header
    return this.headers
  }

  /**
   * 生成请求实的Loading
   * @param options
   */
  private generateRequestLoading(options): any {
    if (!options || !options.loading) {
      return
    }

    this.createLoading(
      typeof options.loading === 'string'
        ? options.loading
        : this.defaultLoadingMessage
    )
  }

  private async createLoading(message) {
    if (!this.loading) {
      this.loading = await this.loadingCtrl.create()
    }
    this.loading.message = message
    this.loading.present()
  }
}
