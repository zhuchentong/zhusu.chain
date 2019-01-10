import { Component, OnInit, ViewChild, HostListener } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { LoggerService } from '@ngx-toolkit/logger'
import { NgxAmapComponent } from 'ngx-amap'
import { RoomService } from 'app/services/room.service'
import { Room } from 'app/models/room.model'
import { PageService } from 'app/utils/page.service'
import { Router } from '@angular/router'
import { UpdateRoomAction } from 'app/store/action/product.action'
import { Product } from 'app/models/product.model'

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss']
})
export class ProductDetailPage implements OnInit {
  // 高德地图组件
  @ViewChild(NgxAmapComponent)
  private amap
  // 酒店信息
  private product
  // 房间列表
  private roomList: Room[] = []
  // 酒店位置
  private position
  // 是否隐藏服务项
  private hiddenServer = false
  // 内容区域距顶部高度(影响header样式)
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
    private router: Router,
    private page: PageService,
    private store: Store
  ) {}

  public ngOnInit() {
    // 获取酒店信息
    this.product = this.store.selectSnapshot(
      state => state.product.current
    ) as Product
    this.position = [this.product.position.lng, this.product.position.lat]
    this.hiddenServer = this.product.facilities.length > 3
    // 获取房间信息
    this.getRoomList()
    this.logger.log(this.product)
    return
  }

  /**
   * 获取房间列表
   * TODO:不应该分页
   */
  public getRoomList() {
    this.roomService
      .getRoomList(this.product.id, {
        page: this.page
      })
      .subscribe(rooms => {
        //  TODO:照片呢？
        this.roomList = rooms
      })
  }

  /**
   * 监听页面滚动
   * @param event
   */
  private onScroll(event) {
    this.scrollTop = event.detail.currentY
  }

  /**
   * 预订房间
   */
  private onOrderRoom(room) {
    // 保存待预订的房间信息
    this.store.dispatch(new UpdateRoomAction(room))
    this.router.navigate([
      'product/product-order',
      {
        id: 1
      }
    ])
  }
}
