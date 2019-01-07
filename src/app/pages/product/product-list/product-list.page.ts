import { Component, OnInit } from '@angular/core'
import { ProductService } from 'app/services/product.service'
import { ActivatedRoute } from '@angular/router'
import { LoggerService } from '@ngx-toolkit/logger'
import { PageService } from 'app/utils/page.service'
import { Hotel } from 'app/models/hotel.model'

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss']
})
export class ProductListPage implements OnInit {
  // 搜索匹配名称
  private name
  private level
  private type
  private hotelList = []
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

  private getProductList() {
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
        this.hotelList = list
      })
  }

  private onOpenSetting() {
    return
  }
}
