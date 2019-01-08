import { Component, OnInit, Input, HostListener } from '@angular/core'
import { Hotel } from 'app/models/hotel.model'
import { Router } from '@angular/router'

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input()
  public product: Hotel

  private array = Array

  constructor(private router: Router) {}

  @HostListener('click')
  public onClick() {
    this.router.navigate(['product/product-detail', { product: this.product }])
  }

  public ngOnInit() {
    return
  }
}
