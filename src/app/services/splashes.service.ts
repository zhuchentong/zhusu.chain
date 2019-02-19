import { Injectable } from '@angular/core'
import { NetService } from 'app/utils/net.service'
import { Observable } from 'rxjs'
import { Store } from '@ngxs/store'
import { splashesController } from 'app/config/service/splashes.controller'

@Injectable()
export class SplashesService {
  constructor(private net: NetService, private store: Store) {}

  /**
   * 获取房间列表
   */
  public getSplashList(): Observable<any> {
    return this.net.send({
      service: splashesController.getSplashList
    })
  }
}
