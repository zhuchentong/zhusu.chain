import { State, Action, StateContext, Selector } from '@ngxs/store'
import { Hotel } from 'app/models/hotel.model'
import { Room } from 'app/models/room.model'
import { ExtendState } from 'app/store/state'
import { AddRecord } from '../action/record.action'
import { plainToClass } from 'class-transformer'

@State({
  name: 'record',
  defaults: []
})
export class RecordState extends ExtendState {
  private readonly maxCount = 50
  /**
   * 添加浏览记录
   * @param param0
   * @param param1
   */
  @Action(AddRecord)
  public addRecord<T>(
    { getState, setState }: StateContext<Hotel[]>,
    { hotel }: AddRecord
  ) {
    // 获取浏览记录
    let recordList = getState()
    // 去除重复记录
    recordList = recordList.filter(x => x.id !== hotel.id)
    // 添加浏览记录
    recordList.unshift(hotel)
    // 浏览记录最大50条
    if (recordList.length > this.maxCount) {
      recordList.length = this.maxCount
    }
    // 更新浏览记录
    setState(recordList)
  }
}
