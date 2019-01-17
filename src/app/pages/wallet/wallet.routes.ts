import { Routes } from '@angular/router'
import { WalletPage } from './wallet.page'
import { WalletInfoPage } from './wallet-info/wallet-info.page'
import { TransferPage } from './transfer/transfer.page'
import { WalletChangePage } from './wallet-change/wallet-change.page'
import { WalletCreatePage } from './wallet-create/wallet-create.page'

export const walletRoutes: Routes = [
  {
    path: '',
    component: WalletPage,
    pathMatch: 'full'
  },
  {
    path: 'wallet-info',
    component: WalletInfoPage
  },
  {
    path: 'wallet-change',
    component: WalletChangePage
  },
  {
    path: 'wallet-create',
    component: WalletCreatePage
  },
  {
    path: 'transfer',
    component: TransferPage
  }
]

export const walletPages = [
  WalletPage,
  WalletInfoPage,
  WalletChangePage,
  TransferPage,
  WalletCreatePage
]
