import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss']
})
export class ProductDetailPage implements OnInit {
  // slide配置
  private readonly slideOptions = {
    autoplay: {
      delay: 5000
    }
  }
  // constructor() { }

  public ngOnInit() {
    return
  }
}
