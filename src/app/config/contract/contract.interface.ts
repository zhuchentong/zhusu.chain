import { ethers } from 'ethers'

export interface IContract {
  name(): string
  decimals(): number
  symbol(): string
  version(): string
  owner(): string
  approve(address: string, value: number): boolean
  totalSupply(): Promise<number>
  transferFrom(from: string, to: string, value: string): Promise<boolean>
  transfer(to: string, value: ethers.utils.BigNumber): Promise<number>
  balanceOf(_owner: string): number
  batchTransfer(receivers: string[], value: number)
  batchFreeze(addresses: string[], freeze: boolean)
  frozenAccount(address: string): boolean
  allowance(owner, spender): number
  transferOwnership(address)
}
