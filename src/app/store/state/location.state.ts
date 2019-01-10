import { State, Action, StateContext } from '@ngxs/store'
import {
  UpdateCityAction,
  UpdateAddressAction,
  UpdatePositionAction
} from '../action/location.action'
import { ExtendState } from '.'
import { ILngLat } from 'ngx-amap'

@State({
  name: 'location',
  defaults: {
    // 城市
    city: '',
    // 地址
    address: '',
    // 位置
    position: {}
  }
})
export class LocationState extends ExtendState {
  /**
   * 更新城市信息
   * @param state
   * @param city
   */
  @Action(UpdateCityAction)
  public updateCity<T>(
    state: StateContext<string>,
    { city }: UpdateCityAction
  ) {
    this.updateState(state, {
      city
    })
  }

  /**
   * 更新地址信息
   * @param state
   * @param city
   */
  @Action(UpdateAddressAction)
  public updateAddress<T>(
    state: StateContext<string>,
    { address }: UpdateAddressAction
  ) {
    this.updateState(state, {
      address
    })
  }

  /**
   * 更新坐标信息
   * @param state
   * @param city
   */
  @Action(UpdatePositionAction)
  public updatePosition<T>(
    state: StateContext<ILngLat>,
    { position }: UpdatePositionAction
  ) {
    this.updateState(state, {
      position
    })
  }
}
