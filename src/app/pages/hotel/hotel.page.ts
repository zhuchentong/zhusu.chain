import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core'
import { DeviceService } from 'app/utils/decive.service'
import { ActionSheetController, ModalController } from '@ionic/angular'
import { SelectStarComponent } from 'app/shared/components/select-star/select-star.component'
import { LevelList } from 'app/config/dict.config'
import { CommonService } from 'app/utils/common.service'

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss']
})
export class HotelPage implements OnInit {
  // slide配置
  private readonly slideOptions = {
    autoplay: {
      delay: 5000
    }
  }

  private readonly levelList = LevelList
  private recommandList = [
    {
      icon: 'assets/image/user_photo.jpg',
      label: '今日特惠'
    },
    {
      icon: 'assets/image/user_photo.jpg',
      label: '集团旗舰'
    },
    {
      icon: 'assets/image/user_photo.jpg',
      label: '高端系列'
    },
    {
      icon: 'assets/image/user_photo.jpg',
      label: '钟点房'
    }
  ]
  private level: number[] = []
  private selectStarModal
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private modalController: ModalController,
    private commonService: CommonService
  ) {}

  public ngOnInit() {
    return
  }

  private getLevelLabel() {
    if (
      this.level.length === 0 ||
      this.level.length === this.levelList.length - 1
    ) {
      return '1~5星级/不限'
    }

    return this.level
      .map(x => this.levelList.find(item => item.key === x).value)
      .join('/')
  }

  private async onSelectLevel() {
    this.commonService.modal(
      SelectStarComponent,
      {
        cssClass: 'top-50'
      },
      ({ data }) => {
        if (data) this.level = data
      }
    )
  }

  private async onSearch() {
    return
  }

  private ngAfterViewInit() {
    const aditems = this.elementRef.nativeElement.querySelectorAll('.ad-item')
    aditems.forEach(item => {
      // 设置背景
      this.renderer2.setStyle(
        item,
        'background-image',
        'url("/assets/image/hotel.jpg")'
      )
      // 设置宽高比
      if (item.classList.contains('left') > -1) {
        this.renderer2.setStyle(item, 'background-size', 'auto 100%')
      } else {
        this.renderer2.setStyle(item, 'background-size', '100% auto')
      }
    })
  }
}
