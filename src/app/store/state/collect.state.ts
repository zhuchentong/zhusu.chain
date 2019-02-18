import {
  State,
  Action,
  StateContext,
  Selector,
  createSelector
} from '@ngxs/store'
import { Hotel } from 'app/models/hotel.model'
import { ExtendState } from 'app/store/state'
import { plainToClass } from 'class-transformer'
import { AddCollect, RemoveCollect } from '../action/collect.action'

@State({
  name: 'collect',
  defaults: []
})
export class CollectState extends ExtendState {
  /**
   * 获取收藏记录
   * @param state
   */
  @Selector()
  public static getCollect(state: Hotel[]) {
    if (state) {
      return plainToClass(Hotel, state)
    } else {
      return []
    }
  }

  /**
   * 是否收藏该记录
   * @param state
   */
  @Selector()
  public static hasCollect(hotelId) {
    return createSelector(
      [CollectState],
      ({ collect }) => {
        return plainToClass(Hotel, collect).find(x => x.id === hotelId)
      }
    )
  }

  /**
   * 添加浏览记录
   * @param param0
   * @param param1
   */
  @Action(AddCollect)
  public addCollect<T>(
    { getState, setState }: StateContext<Hotel[]>,
    { hotel }: AddCollect
  ) {
    // 获取浏览记录
    const collectList = getState()
    // 判断是否已收藏
    const target = collectList.find(x => x.id === hotel.id)
    if (!target) {
      // 添加收藏记录
      collectList.push(hotel)
      // 更新收藏记录
      setState(collectList)
    }
  }

  /**
   * 添加浏览记录
   * @param param0
   * @param param1
   */
  @Action(RemoveCollect)
  public removeCollect<T>(
    { getState, setState }: StateContext<Hotel[]>,
    { hotel }: RemoveCollect
  ) {
    // 获取浏览记录
    let collectList = getState()
    // 去除待删除记录
    collectList = collectList.filter(x => x.id !== hotel.id)
    // 更新浏览记录
    setState(collectList)
  }
}
