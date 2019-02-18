import { Injectable } from '@angular/core'

@Injectable()
export class PageService {
  public pageIndex: number
  public total: number
  public pageSize: number
  public loading: boolean
  public totalPage: number
  public complete = false

  constructor({ pageSize } = { pageSize: 10 }) {
    this.pageIndex = 1
    this.total = 0
    this.pageSize = pageSize
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

  public next() {
    if (!this.complete) {
      this.pageIndex += 1
      this.checkComplete()
    }
  }

  public reset() {
    this.pageIndex = 1
    this.loading = false
    this.complete = false
  }

  /**
   * 更新分页配置信息
   * @param param
   */
  public update(total) {
    this.total = total
    this.totalPage = Math.ceil(this.total / this.pageSize)
    this.checkComplete()
  }

  private checkComplete() {
    if (this.pageIndex >= this.totalPage) {
      this.complete = true
    }
  }
}
