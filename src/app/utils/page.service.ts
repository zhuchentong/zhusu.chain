import { Injectable } from '@angular/core'

@Injectable()
export class PageService {
  public pageIndex: number
  public total: number
  public pageSize: number
  public loading: boolean
  public totalPage: number

  constructor() {
    this.pageIndex = 1
    this.total = 0
    this.pageSize = 10
    this.loading = false
  }

  /**
   * 获取分页配置信息
   */
  public getConfig() {
    return {
      page: this.pageIndex - 1,
      size: this.pageSize
    }
  }

  /**
   * 更新分页配置信息
   * @param param
   */
  public update({ totalElements, totalPages }) {
    this.total = totalElements
    this.totalPage = totalPages
  }
}
