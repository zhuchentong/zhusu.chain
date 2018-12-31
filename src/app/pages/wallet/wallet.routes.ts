import { Routes } from '@angular/router'
import { WalletPage } from './wallet.page'
import { WalletInfoPage } from './wallet-info/wallet-info.page'
import { TransferPage } from './transfer/transfer.page'

export const walletRoutes: Routes = [
  {
    path: '',
    component: WalletPage
  },
  {
    path: 'wallet-info',
    component: WalletInfoPage
  },
  {
    path: 'transfer',
    component: TransferPage
  }
]

export const walletPages = [WalletPage, WalletInfoPage, TransferPage]
