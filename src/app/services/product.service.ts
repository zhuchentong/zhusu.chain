import { Injectable } from '@angular/core'
import { NetService } from 'app/utils/net.service'
import { productController } from 'app/config/service/product.controller'
import { User } from 'app/models/user.model'
import { Observable } from 'rxjs'
import { Store } from '@ngxs/store'
import { Hotel } from 'app/models/hotel.model'
import { productEnum } from 'app/config/enum.config'
import { PageService } from 'app/utils/page.service'

@Injectable()
export class ProductService {
  constructor(private net: NetService, private store: Store) {}

  /**
   * 获取用户
   */
  public getProductList(
    { name, level, type }: { name?; level?; type: productEnum },
    { page }: { page?: PageService }
  ): Observable<Hotel[]> {
    // 获取位置信息
    const location = this.store.selectSnapshot(state => state.location)

    return this.net.send({
      service: productController.getProductList,
      model: Hotel,
      page,
      params: {
        name,
        type,
        minGrand: level && level.length > 0 ? level[0] : null,
        maxGrand: level && level.length > 0 ? level[level.length - 1] : null,
        lat: location.position.latitude,
        lng: location.position.longitude
      }
    })
  }
}
