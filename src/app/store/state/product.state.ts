import { State, Action, StateContext } from '@ngxs/store'
import {
  UpdateRoomAction,
  UpdateHomeAction,
  UpdateHotelAction
} from '../action/product.action'
import { Hotel } from 'app/models/hotel.model'
import { Room } from 'app/models/room.model'
import { ExtendState } from 'app/store/state'
import { Home } from 'app/models/home.model'

@State({
  name: 'product',
  defaults: {
    hotel: null,
    home: null,
    current: null,
    room: null
  }
})
export class ProductState extends ExtendState {
  /**
   * 更新酒店信息
   * @param param0
   * @param param1
   */
  @Action(UpdateHotelAction)
  public updateHotel<T>(
    state: StateContext<Hotel>,
    { hotel }: UpdateHotelAction
  ) {
    this.updateState(state, {
      hotel,
      current: hotel
    })
  }

  /**
   * 更新酒店信息
   * @param param0
   * @param param1
   */
  @Action(UpdateHomeAction)
  public updateHome<T>(state: StateContext<Home>, { home }: UpdateHomeAction) {
    this.updateState(state, {
      home,
      current: home
    })
  }

  /**
   * 更新房间信息
   * @param param0
   * @param param1
   */
  @Action(UpdateRoomAction)
  public updateRoom<T>(
    { setState }: StateContext<Room>,
    { room }: UpdateRoomAction
  ) {
    setState(room)
  }
}
