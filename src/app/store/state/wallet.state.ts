import {
  State,
  Action,
  StateContext,
  Selector,
  createSelector
} from '@ngxs/store'
import { ExtendState } from 'app/store/state'
import {
  AddWalletAction,
  RemoveWalletAction,
  UpdateWalletAction,
  SetCurrentWalletAction
} from '../action/wallet.action'
import { plainToClass } from 'class-transformer'
import { Wallet } from 'app/models/wallet.model'

@State({
  name: 'wallet',
  defaults: {
    current: '',
    walletList: []
  }
})
export class WalletState extends ExtendState {
  /**
   * 获取当前钱包
   * @param state
   */
  @Selector()
  public static getCurrentWallet() {
    return createSelector(
      [WalletState],
      ({ wallet: state }) => {
        if (state.current) {
          const wallet = state.walletList.find(x => x.address === state.current)
          return plainToClass<Wallet, Wallet>(Wallet, wallet)
        } else {
          return null
        }
      }
    )
  }

  /**
   * 获取钱包列表
   * @param state
   */
  @Selector()
  public static getWalletList(state) {
    return plainToClass(Wallet, state.walletList) || []
  }

  /**
   * 添加钱包
   * @param param0
   * @param param1
   */
  @Action(AddWalletAction)
  public addWallet<T>(state: StateContext<any>, { wallet }: AddWalletAction) {
    const { getState } = state
    const { current, walletList } = getState()
    walletList.push(wallet)
    // 更新钱包列表
    this.updateState(state, {
      walletList
    })
    // 更新默认钱包地址
    if (!current) {
      this.updateState(state, {
        current: wallet.address
      })
    }
  }

  /**
   * 删除钱包
   * @param param0
   * @param param1
   */
  @Action(RemoveWalletAction)
  public removeWallet<T>(
    state: StateContext<any>,
    { address }: RemoveWalletAction
  ) {
    const { getState } = state
    const { current, walletList } = getState()
    // 待删除钱包
    const toRemoveWallet = walletList.find(x => x.address === address)

    if (toRemoveWallet) {
      return
    }

    // 判断是否需要更新当前钱包地址
    if (toRemoveWallet.address === current) {
      const newCurrentWallet = walletList.find(
        x => x.address !== toRemoveWallet.address
      )
      this.updateState(state, {
        current: newCurrentWallet ? newCurrentWallet.address : ''
      })
    }

    // 更新钱包列表
    this.updateState(state, {
      walletList: walletList.filter(wallet => wallet !== toRemoveWallet)
    })
  }

  /**
   * 更新钱包
   * @param param0
   * @param param1
   */
  @Action(UpdateWalletAction)
  public updateWallet<T>(
    state: StateContext<any>,
    { wallet }: UpdateWalletAction
  ) {
    const { getState } = state
    const { current, walletList } = getState()
    const walletIndex = walletList.findIndex(x => x.address === wallet.address)
    if (walletIndex < 0) {
      return
    }
    // 更新钱包数据
    walletList[walletIndex] = wallet
    // 更新钱包列表
    this.updateState(state, {
      walletList
    })
  }

  /**
   * 更新钱包
   * @param param0
   * @param param1
   */
  @Action(SetCurrentWalletAction)
  public setCurrentWallet<T>(
    state: StateContext<any>,
    { address }: SetCurrentWalletAction
  ) {
    const { getState } = state
    const { current, walletList } = getState()
    const wallet = walletList.find(x => x.address === address)
    if (wallet) {
      // 更新当前钱包地址
      this.updateState(state, {
        current: address
      })
    }
  }
}
