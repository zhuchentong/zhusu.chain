import { Component, OnInit } from '@angular/core'
import { ProductService } from 'app/services/product.service'
import { ActivatedRoute } from '@angular/router'
import { LoggerService } from '@ngx-toolkit/logger'

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

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private logger: LoggerService
  ) {}

  public ngOnInit() {
    this.level = this.route.snapshot.paramMap.get('level').split(',')
    this.type = this.route.snapshot.paramMap.get('type')
    this.getProductList()
  }

  private getProductList() {
    this.productService
      .getProductList(this.name, this.level, this.type)
      .subscribe(data => this.logger.log(data))
  }

  private onOpenSetting() {
    return
  }
}
