import { Hotel } from 'app/models/hotel.model'
import { Room } from 'app/models/room.model'
import { IDateRange } from 'app/config/interface.config'

/**
 * 更新待预订的酒店
 */
export class UpdateHotelAction {
  public static readonly type = '[Hotel] UpdateHotel'
  constructor(public hotel: Hotel) {}
}

/**
 * 更新待预订的房间
 */
export class UpdateRoomAction {
  public static readonly type = '[Hotel] UpdateRoom'
  constructor(public room: Room) {}
}

/**
 * 更新待预订的时间
 */
export class UpdateDateAction {
  public static readonly type = '[Hotel] UpdateDate'
  constructor(public dateRange: IDateRange) {}
}
