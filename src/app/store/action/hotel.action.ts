import { Hotel } from 'app/models/hotel.model'
import { Room } from 'app/models/room.model'

export class UpdateHotelAction {
  public static readonly type = '[Product] UpdateHotel'
  constructor(public hotel: Hotel) {}
}

export class UpdateRoomAction {
  public static readonly type = '[Product] UpdateRoom'
  constructor(public room: Room) {}
}
