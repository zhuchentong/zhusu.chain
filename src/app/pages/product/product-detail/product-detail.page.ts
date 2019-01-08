import { Component, OnInit, ViewChild } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { LoggerService } from '@ngx-toolkit/logger'
import { NgxAmapComponent } from 'ngx-amap'

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
  // slide配置
  private readonly slideOptions = {
    autoplay: {
      delay: 5000
    }
  }
  constructor(private logger: LoggerService, private store: Store) {}

  public ngOnInit() {
    this.product = this.store.selectSnapshot(state => state.product)
    this.position = [this.product.position.lng, this.product.position.lat]
    this.logger.log(this.product)
    return
  }

  private getPosition() {
    return
  }
}
