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
import { ifStmt } from '@angular/compiler/src/output/output_ast'

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.page.html',
  styleUrls: ['./hotel-list.page.scss']
})
export class HotelListPage implements OnInit {
  @ViewChild(HotelFilterComponent)
  private hotelFilterComponent
  private page = new PageService()
  // 搜索匹配名称
  private filter = {
    name: '',
    level: [],
    type: undefined
  }
  // TODO:日期范围
  private hotelList = []
  constructor(
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private commonService: CommonService,
    private menuController: MenuController
  ) {}

  public ngOnInit() {
    this.menuController.enable(true, 'filter')
    this.filter.level = this.route.snapshot.paramMap
      .get('level')
      .split(',')
      .filter(x => !!x)
    this.filter.type = this.route.snapshot.paramMap.get('type')
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
      .getHotelList(
        {
          name: this.filter.name,
          level: this.filter.level,
          type: this.filter.type
        },
        {
          page: this.page
        }
      )
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

  private onResetFilter() {
    this.hotelFilterComponent.reset()
  }

  private onSumbitFilter() {
    this.filter = this.hotelFilterComponent.getFilter()
    this.page.reset()
    this.hotelList = []
    this.getHotelList()
    this.menuController.close('filter')
  }
}
