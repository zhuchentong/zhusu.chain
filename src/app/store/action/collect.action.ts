import { Hotel } from 'app/models/hotel.model'

// 添加收藏记录
export class AddCollect {
  public static readonly type = '[collect] AddCollect'
  constructor(public hotel: Hotel) {}
}

// 删除收藏记录
export class RemoveCollect {
  public static readonly type = '[collect] RemoveCollect'
  constructor(public hotel: Hotel) {}
}
