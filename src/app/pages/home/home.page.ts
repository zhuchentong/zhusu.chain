import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  ViewChild
} from '@angular/core'
import { ActionSheetController, ModalController } from '@ionic/angular'
import { CommonService } from 'app/utils/common.service'
import { SelectStarComponent } from 'app/shared/components/select-star/select-star.component'
import { LevelList } from 'app/config/dict.config'
import { Router } from '@angular/router'
import { SelectDateComponent } from 'app/shared/components/select-date/select-date.component'
import { Store } from '@ngxs/store'
import { HotelPage } from '../hotel/hotel.page'
import { ProductEnum } from 'app/config/enum.config'

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

  private readonly levelList = LevelList
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
  private level: number[] = []

  @ViewChild(SelectDateComponent)
  private selectDateComponent

  constructor(
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private commonService: CommonService,
    private router: Router,
    private store: Store
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

  /**
   * 跳转搜索页面
   */
  private async onSearch() {
    const position = this.store.selectSnapshot(state => state.location.position)
    if (position.latitude && position.longitude) {
      this.router.navigate([
        '/product/product-list',
        {
          type: ProductEnum.HOME,
          level: this.level
        }
      ])
    } else {
      this.commonService.toast('无法定位当前位置,请重试.')
    }
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
