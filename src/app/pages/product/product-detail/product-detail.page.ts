import { Component, OnInit, ViewChild, HostListener } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { LoggerService } from '@ngx-toolkit/logger'
import { NgxAmapComponent } from 'ngx-amap'
import { RoomService } from 'app/services/room.service'

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss']
})
export class ProductDetailPage implements OnInit {
  @ViewChild(NgxAmapComponent)
  private amap
  private product
  private position
  private array = Array
  private hiddenServer = false
  private scrollTop = 0
  // slide配置
  private readonly slideOptions = {
    autoplay: {
      delay: 5000
    }
  }
  constructor(
    private roomService: RoomService,
    private logger: LoggerService,
    private store: Store
  ) {}

  public ngOnInit() {
    // 获取酒店信息
    this.product = this.store.selectSnapshot(state => state.product)
    this.position = [this.product.position.lng, this.product.position.lat]
    this.hiddenServer = this.product.facilities.length > 3
    // 获取房间信息
    this.getRoomList()
    this.logger.log(this.product)
    return
  }

  /**
   * 获取房间列表
   */
  public getRoomList() {
    this.roomService.getRoomList(this.product.id).subscribe(rooms => {
      this.logger.log(rooms)
    })
  }

  private onScroll(event) {
    this.scrollTop = event.detail.currentY
  }
}
