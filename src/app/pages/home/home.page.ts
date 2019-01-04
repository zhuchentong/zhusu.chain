import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core'
import { ActionSheetController, ModalController } from '@ionic/angular'
import { SearchAddressPage } from '../common/search-address/search-address.page'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
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
      label: '星选民宿'
    },
    {
      icon: 'assets/image/user_photo.jpg',
      label: '网红民宿'
    },
    {
      icon: 'assets/image/user_photo.jpg',
      label: '田园民宿'
    },
    {
      icon: 'assets/image/user_photo.jpg',
      label: '旅行轻奢'
    }
  ]
  private level
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private modalController: ModalController
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

  private async onSearch() {
    // Create a modal using MyModalComponent with some initial data
    // const modal = await this.modalController.create({
    //   component: SearchAddressPage,
    //   showBackdrop: true,
    //   backdropDismiss: true,
    //   cssClass: 'top-50'
    // })
    // modal.present()
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
