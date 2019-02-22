import {
  State,
  Action,
  StateContext,
  Selector,
  createSelector,
  UpdateState
} from '@ngxs/store'
import { ExtendState } from 'app/store/state'
import { UpdateCollectTime, AddCoin, RemoveCoin } from '../action/coin.action'

@State({
  name: 'coin',
  defaults: {
    lastTime: 0,
    coinCount: 0
  }
})
export class CoinState extends ExtendState {
  /**
   * 更新采集时间
   * @param param0
   */
  @Action(UpdateCollectTime)
  public updateCollectTime<T>(state: StateContext<T>) {
    this.updateState(state, {
      lastTime: +Date.now()
    })
  }

  /**
   * 添加未采集金币
   * @param param0
   * @param param1
   */
  @Action(AddCoin)
  public addCoin<T>(state: StateContext<any>, { count }: AddCoin) {
    const coinCount = state.getState().coinCount
    this.updateState(state, {
      coinCount: coinCount + count
    })
  }

  /**
   * 添加未采集金币
   * @param param0
   * @param param1
   */
  @Action(RemoveCoin)
  public removeCoin<T>(state: StateContext<any>) {
    const coinCount = state.getState().coinCount
    if (coinCount > 0) {
      this.updateState(state, {
        coinCount: coinCount - 1
      })
    }
  }
}
