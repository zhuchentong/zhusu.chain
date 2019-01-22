import { Model } from 'app/models'
import { Expose, Type } from 'class-transformer'
import { User } from './user.model'
import { ethers } from 'ethers'
import { ReflectiveInjector } from '@angular/core'
import { EtherService } from 'app/utils/ether.service'
import { CommonService } from 'app/utils/common.service'
import { SharedModule } from 'app/shared/shared.module'
export class Wallet extends Model {
  // 钱包名称
  public name: string
  // 钱包数据
  public data: string
  // 钱包地址
  public address: string
  // 钱包所属用户
  public user
  // 钱包余额
  public balance?
}
