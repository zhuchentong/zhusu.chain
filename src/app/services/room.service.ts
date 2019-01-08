import { Injectable } from '@angular/core'
import { NetService } from 'app/utils/net.service'
import { Observable } from 'rxjs'
import { Store } from '@ngxs/store'
import { Room } from 'app/models/room.model'
import { roomController } from 'app/config/service/room.controller'
@Injectable()
export class RoomService {
  constructor(private net: NetService, private store: Store) {}

  /**
   * 获取房间列表
   */
  public getRoomList(): Observable<Room[]> {
    return this.net.send({
      service: roomController.getRoomList,
      model: Room,
      params: {}
    })
  }
}
