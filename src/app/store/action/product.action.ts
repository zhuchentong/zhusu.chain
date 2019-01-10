import { Hotel } from 'app/models/hotel.model'
import { Room } from 'app/models/room.model'
import { Home } from 'app/models/home.model'

export class UpdateHotelAction {
  public static readonly type = '[Product] UpdateHotel'
  constructor(public hotel: Hotel) {}
}

export class UpdateHomeAction {
  public static readonly type = '[Product] UpdateHome'
  constructor(public home: Home) {}
}

export class UpdateRoomAction {
  public static readonly type = '[Product] UpdateRoom'
  constructor(public room: Room) {}
}
