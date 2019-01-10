import { ILatLng } from 'app/config/interface.config'

// 更新城市事件
export class UpdateCityAction {
  public static readonly type = '[Location] UpdateCity'
  constructor(public city: string) {}
}

// 更新地址事件
export class UpdateAddressAction {
  public static readonly type = '[Location] UpdateAddress'
  constructor(public address: string) {}
}

// 更新坐标事件
export class UpdatePositionAction {
  public static readonly type = '[Location] UpdatePosition'
  constructor(public position: ILatLng) {}
}
