import {
  Component,
  OnInit,
  Directive,
  QueryList,
  ContentChildren,
  ElementRef,
  Renderer2
} from '@angular/core'
import { DeviceService } from 'app/utils/decive.service'
import { ActionSheetController } from '@ionic/angular'

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

  private readonly levelList = ['不限', '一星', '二星', '三星', '四星', '五星']
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
  private level
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private elementRef: ElementRef,
    private renderer2: Renderer2
  ) {}

  public ngOnInit() {
    return
  }

  private async onSelectLevel() {
    const buttons = this.levelList.map((item, index) => ({
      text: item,
      handler: () => {
        this.level = index
      }
    }))

    const actionSheet = await this.actionSheetCtrl.create({
      header: '选择星级',
      buttons
    })

    await actionSheet.present()
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
