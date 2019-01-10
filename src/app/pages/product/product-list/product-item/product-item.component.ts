import { Component, OnInit, Input, HostListener } from '@angular/core'
import { Hotel } from 'app/models/hotel.model'
import { Router } from '@angular/router'
import { RoomService } from 'app/services/room.service'
import { LoggerService } from '@ngx-toolkit/logger'
import { UpdateHotelAction } from 'app/store/action/product.action'
import { Store } from '@ngxs/store'
import { PageService } from 'app/utils/page.service'

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input()
  public product: Hotel
  // 当前酒店的最低价格
  private price
  // 用于辅助生成数组的Array类型
  private array = Array

  constructor(
    private roomService: RoomService,
    private logger: LoggerService,
    private page: PageService,
    private store: Store,
    private router: Router
  ) {}

  public ngOnInit() {
    this.getRoomList()
  }

  @HostListener('click')
  public onClick() {
    // 更新当前product
    this.product.updateStore(this.store)
    // 跳转产品详情
    this.router.navigate(['product/product-detail'])
  }

  /**
   * 获取房间价格
   */
  public getRoomList() {
    this.roomService
      .getRoomList(this.product.id, {
        page: this.page
      })
      .subscribe(rooms => {
        this.logger.log(rooms)
      })
  }
}
