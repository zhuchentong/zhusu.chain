import { Wallet } from 'app/models/wallet.model'

/**
 * 添加钱包
 */
export class AddWalletAction {
  public static readonly type = '[Wallet] AddWallet'
  constructor(public wallet: Wallet) {}
}

/**
 * 删除钱包
 */
export class RemoveWalletAction {
  public static readonly type = '[Wallet] RemoveWallet'
  constructor(public address: string) {}
}

/**
 * 更新钱包
 * 不能更新钱包地址
 */
export class UpdateWalletAction {
  public static readonly type = '[Wallet] UpdateWallet'
  constructor(public wallet: Wallet) {}
}

/**
 * 设置当前钱包
 */
export class SetCurrentWalletAction {
  public static readonly type = '[Wallet] SetCurrentWallet'
  constructor(public address: string) {}
}
