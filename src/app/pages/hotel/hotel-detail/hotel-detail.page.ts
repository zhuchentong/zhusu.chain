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
import { HotelService } from 'app/services/hotel.service'
import { CollectState } from 'app/store/state/collect.state'
import { AddCollect, RemoveCollect } from 'app/store/action/collect.action'
import { CommonService } from 'app/utils/common.service'
import { NativeService } from 'app/utils/native.service'
import { CommentService } from 'app/services/commnet.service'

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
  // 是否收藏
  private isCollect
  // 评论数据
  private comment
  // 分页服务
  private page = new PageService({ pageSize: 100 })
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
    private nativeService: NativeService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private commentSerivce: CommentService,
    private store: Store
  ) {}

  public ngOnInit() {
    // 对应酒店ID
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10)

    if (id) {
      // 获取酒店信息
      this.getHotel(id)
      // 获取房间列表
      this.getRoomList(id)
      // 获取酒店评论信息
      this.getComment(id)
      // 判断收否已经收藏
      this.isCollect = this.store.selectSnapshot(CollectState.hasCollect(id))
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
      this.hiddenServer =
        this.hotel.facilities && this.hotel.facilities.length > 3
    })
  }

  public getComment(id) {
    this.commentSerivce.commentDetail(id).subscribe(comment => {
      this.comment = comment
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

  /**
   * 修改收藏状态
   */
  private onCollect() {
    // 收藏/取消收藏
    this.store.dispatch(
      new (this.isCollect ? RemoveCollect : AddCollect)(this.hotel)
    )
    this.isCollect = !this.isCollect
    this.commonService.toast(this.isCollect ? '收藏成功' : '取消收藏', 1000)
  }

  /**
   * 分享
   */
  private onShare() {
    this.nativeService.share('TODO: 在这里填写分享内容')
  }
}
