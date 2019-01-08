import { Component, OnInit, ViewChild } from '@angular/core'
import { ProductService } from 'app/services/product.service'
import { ActivatedRoute } from '@angular/router'
import { LoggerService } from '@ngx-toolkit/logger'
import { PageService } from 'app/utils/page.service'
import { Hotel } from 'app/models/hotel.model'
import { IonInfiniteScroll } from '@ionic/angular'

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss']
})
export class ProductListPage implements OnInit {
  @ViewChild(IonInfiniteScroll)
  private infiniteScroll: IonInfiniteScroll
  // 搜索匹配名称
  private name
  private level
  private type
  // TODO:日期范围
  private productList = []
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private page: PageService
  ) {}

  public ngOnInit() {
    this.level = this.route.snapshot.paramMap.get('level').split(',')
    this.type = this.route.snapshot.paramMap.get('type')
    this.getProductList()
  }

  /**
   * 获取产品列表
   * @param event
   */
  private getProductList(event?) {
    this.productService
      .getProductList(
        {
          name: this.name,
          level: this.level,
          type: this.type
        },
        {
          page: this.page
        }
      )
      .subscribe((list: Hotel[]) => {
        this.productList = list
        // TODO:最后一页禁用
        if (event) {
          event.target.complete()
        }
      })
  }

  private onOpenSetting() {
    return
  }
}
