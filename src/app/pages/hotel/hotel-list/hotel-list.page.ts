import { Component, OnInit, ViewChild } from '@angular/core'
import { HotelService } from 'app/services/hotel.service'
import { ActivatedRoute } from '@angular/router'
import { LoggerService } from '@ngx-toolkit/logger'
import { PageService } from 'app/utils/page.service'
import { Hotel } from 'app/models/hotel.model'
import { IonInfiniteScroll, MenuController } from '@ionic/angular'
import { CommonService } from 'app/utils/common.service'
import { HotelFilterComponent } from './hotel-filter/hotel-filter.component'
import { LevelList } from 'app/config/dict.config'
import { Store } from '@ngxs/store'

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.page.html',
  styleUrls: ['./hotel-list.page.scss']
})
export class HotelListPage implements OnInit {
  @ViewChild(HotelFilterComponent)
  private hotelFilterComponent
  private page = new PageService()
  private position
  // 搜索匹配名称
  private filter = {
    name: '',
    level: [],
    type: undefined,
    tags: ''
  }
  // TODO:日期范围
  private hotelList = []
  constructor(
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private store: Store,
    private commonService: CommonService,
    private menuController: MenuController
  ) {}

  public ngOnInit() {
    this.menuController.enable(true, 'filter')
    // 获取当前位置信息
    const { latitude, longitude } = this.store.selectSnapshot(
      state => state.location.position
    )
    this.position = [longitude, latitude]
    // 设置过滤数据
    this.filter.type = this.route.snapshot.paramMap.get('type')
    this.filter.tags = this.route.snapshot.paramMap.get('tags')
    this.filter.level = (this.route.snapshot.paramMap.get('level') || '')
      .split(',')
      .filter(x => !!x)
    // 获取酒店列表
    this.getHotelList()
  }

  /**
   * 获取产品列表
   * @param event
   */
  private getHotelList(event?) {
    if (this.page.complete) return event && event.target.complete()
    // 更新页数
    event && this.page.next()
    this.hotelService
      .getHotelList(this.filter, {
        page: this.page
      })
      .subscribe((list: Hotel[]) => {
        this.hotelList.push(...list)
        event && event.target.complete()
      })
  }

  /**
   * 筛选房间
   */
  private onOpenFilter() {
    this.menuController.open('filter')
  }

  /**
   * 终止筛选条件
   */
  private onResetFilter() {
    this.hotelFilterComponent.reset()
  }

  /**
   * 提交筛选结果
   */
  private onSumbitFilter() {
    this.filter = this.hotelFilterComponent.getFilter()
    this.page.reset()
    this.hotelList = []
    this.getHotelList()
    this.menuController.close('filter')
  }
}
