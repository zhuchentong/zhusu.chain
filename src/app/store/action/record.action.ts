import { Hotel } from 'app/models/hotel.model'

// 添加浏览记录
export class AddRecord {
  public static readonly type = '[Record] AddRecord'
  constructor(public hotel: Hotel) {}
}
