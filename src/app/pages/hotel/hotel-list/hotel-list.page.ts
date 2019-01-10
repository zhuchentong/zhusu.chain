import { Component, OnInit, ViewChild } from '@angular/core'
import { HotelService } from 'app/services/hotel.service'
import { ActivatedRoute } from '@angular/router'
import { LoggerService } from '@ngx-toolkit/logger'
import { PageService } from 'app/utils/page.service'
import { Hotel } from 'app/models/hotel.model'
import { IonInfiniteScroll } from '@ionic/angular'

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.page.html',
  styleUrls: ['./hotel-list.page.scss']
})
export class HotelListPage implements OnInit {
  @ViewChild(IonInfiniteScroll)
  private infiniteScroll: IonInfiniteScroll
  // 搜索匹配名称
  private name
  private level
  private type
  // TODO:日期范围
  private hotelList = []
  constructor(
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private page: PageService
  ) {}

  public ngOnInit() {
    this.level = this.route.snapshot.paramMap.get('level').split(',')
    this.type = this.route.snapshot.paramMap.get('type')
    this.getHotelList()
  }

  /**
   * 获取产品列表
   * @param event
   */
  private getHotelList(event?) {
    this.hotelService
      .getHotelList(
        {
          name: this.name,
          level: this.level,
          type: this.type
        },
        {
          page: this.page
        }
      )
      .subscribe((list: Hotel[]) => {
        this.hotelList = list
        // TODO:最后一页禁用
        if (event) {
          event.target.complete()
        }
      })
  }

  private onOpenSetting() {
    return
  }
}
