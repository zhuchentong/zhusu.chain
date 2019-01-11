import { Component, OnInit, ViewChild, HostListener } from '@angular/core'
import { Store } from '@ngxs/store'
import { LoggerService } from '@ngx-toolkit/logger'
import { NgxAmapComponent } from 'ngx-amap'
import { RoomService } from 'app/services/room.service'
import { Room } from 'app/models/room.model'
import { PageService } from 'app/utils/page.service'
import { ActivatedRoute, Router } from '@angular/router'
import {
  UpdateRoomAction,
  UpdateHotelAction
} from 'app/store/action/hotel.action'
import { Hotel } from 'app/models/hotel.model'
import { HotelService } from 'app/services/hotel.service'

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.page.html',
  styleUrls: ['./hotel-detail.page.scss']
})
export class HotelDetailPage implements OnInit {
  // 高德地图组件
  @ViewChild(NgxAmapComponent)
  private amap
  // 酒店信息
  private hotel
  // 房间列表
  private roomList: Room[] = []
  // 酒店位置
  private position
  // 是否隐藏服务项
  private hiddenServer = false
  // 内容区域距顶部高度(影响header样式)
  private scrollTop = 0
  // 最低价格
  private price
  // slide配置
  private readonly slideOptions = {
    autoplay: {
      delay: 5000
    }
  }

  constructor(
    private hotelService: HotelService,
    private roomService: RoomService,
    private logger: LoggerService,
    private router: Router,
    private route: ActivatedRoute,
    private page: PageService,
    private store: Store
  ) {}

  public ngOnInit() {
    // 对应酒店ID
    const id = this.route.snapshot.paramMap.get('id')

    if (id) {
      // 获取酒店信息
      this.getHotel(id)
      // 获取房间列表
      this.getRoomList(id)
    }
  }

  /**
   * 获取酒店信息
   * @param id
   */
  public getHotel(id) {
    this.hotelService.getHotel(id).subscribe(hotel => {
      this.hotel = hotel
      this.position = [this.hotel.position.lng, this.hotel.position.lat]
      this.hiddenServer = this.hotel.facilities.length > 3
    })
  }
  /**
   * 获取房间列表
   * TODO:不应该分页
   */
  public getRoomList(id) {
    this.roomService
      .getRoomList(id, {
        page: this.page
      })
      .subscribe(rooms => {
        //  TODO:照片呢？
        this.roomList = rooms
        this.price =
          rooms.length > 0
            ? rooms.map(x => x.price).reduce((x, y) => x + y) / rooms.length
            : -1
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
    // 保存待预订的酒店信息
    this.store.dispatch(new UpdateHotelAction(this.hotel))
    // 保存待预订的房间信息
    this.store.dispatch(new UpdateRoomAction(room))
    this.router.navigate(['hotel/hotel-order'])
  }
}
