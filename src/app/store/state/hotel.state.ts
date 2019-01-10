import { State, Action, StateContext } from '@ngxs/store'
import { UpdateRoomAction, UpdateHotelAction } from '../action/hotel.action'
import { Hotel } from 'app/models/hotel.model'
import { Room } from 'app/models/room.model'
import { ExtendState } from 'app/store/state'

@State({
  name: 'product',
  defaults: {
    // 待预订的酒店信息
    hotel: null,
    // 待预订的房间信息
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
