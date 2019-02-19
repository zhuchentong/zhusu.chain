import { Injectable } from '@angular/core'
import { NetService } from 'app/utils/net.service'
import { Observable } from 'rxjs'
import { Store } from '@ngxs/store'
import { advertisementsController } from 'app/config/service/advertisements.controller'

@Injectable()
export class AdvertisementsService {
  constructor(private net: NetService, private store: Store) {}

  /**
   * 获取房间列表
   */
  public getAdList(): Observable<any> {
    return this.net.send({
      service: advertisementsController.getAdList
    })
  }
}
