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
import { CommonService } from 'app/utils/common.service'

@State({
  name: 'coin',
  defaults: {
    lastTime: 0,
    coinList: []
  }
})
export class CoinState extends ExtendState {
  constructor(private commonService: CommonService) {
    super()
  }
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
  public addCoin<T>(state: StateContext<any>, { coins }: AddCoin) {
    if (coins.length < 0) {
      return
    }
    const coinList = [...state.getState().coinList, ...coins]

    this.updateState(state, {
      coinList
    })
  }

  /**
   * 添加未采集金币
   * @param param0
   * @param param1
   */
  @Action(RemoveCoin)
  public removeCoin<T>(state: StateContext<any>, { id }: RemoveCoin) {
    const coinList = state.getState().coinList
    if (coinList.length > 0) {
      this.updateState(state, {
        coinList: coinList.filter(coin => coin.id !== id)
      })
    }
  }
}
