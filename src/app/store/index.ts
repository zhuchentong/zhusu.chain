import { UserState } from './state/user.state'
import { LocationState } from './state/location.state'
import { HotelState } from './state/hotel.state'
import { WalletState } from './state/wallet.state'
import { RecordState } from './state/record.state'
import { CollectState } from './state/collect.state'
import { CoinState } from './state/coin.state'

export const states = [
  UserState,
  CoinState,
  LocationState,
  HotelState,
  WalletState,
  RecordState,
  CollectState
]
