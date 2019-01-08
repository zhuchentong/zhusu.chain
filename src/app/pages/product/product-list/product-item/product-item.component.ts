import { Component, OnInit, Input, HostListener } from '@angular/core'
import { Hotel } from 'app/models/hotel.model'
import { Router } from '@angular/router'
import { RoomService } from 'app/services/room.service'
import { LoggerService } from '@ngx-toolkit/logger'
import { UpdateProductAction } from 'app/store/action/product.action'
import { Store } from '@ngxs/store'

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
    private store: Store,
    private router: Router
  ) {}

  @HostListener('click')
  public onClick() {
    // 更新当前product
    this.store.dispatch(new UpdateProductAction(this.product))
    // 跳转产品详情
    this.router.navigate(['product/product-detail', { product: this.product }])
  }

  public ngOnInit() {
    this.getRoomList()
  }

  /**
   * 获取房间价格
   */
  public getRoomList() {
    this.roomService.getRoomList(this.product.id).subscribe(rooms => {
      this.logger.log(rooms)
    })
  }
}
