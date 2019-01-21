import { Component, OnInit } from '@angular/core'
import { Store } from '@ngxs/store'
import { WalletState } from 'app/store/state/wallet.state'
import { Wallet } from 'app/models/wallet.model'
import { ActivatedRoute } from '@angular/router'
import { TokenEnum } from 'app/config/enum.config'
import { EtherService } from 'app/utils/ether.service'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { IToken, ITransferParams } from 'app/config/interface.config'
import { ValidateService } from 'app/utils/validate.service'
import { CommonService } from 'app/utils/common.service'
import { Location } from '@angular/common'
import { Observable } from 'rxjs'
import { finalize } from 'rxjs/operators'
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.page.html',
  styleUrls: ['./transfer.page.scss']
})
export class TransferPage implements OnInit {
  private transferInstance: Transfer
  private currentWallet: Wallet
  private token: TokenEnum
  private transferForm: FormGroup
  private tokenInfo: IToken

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private store: Store,
    private commonService: CommonService,
    private etherService: EtherService,
    private location: Location
  ) {}

  public ngOnInit() {
    // 初始化表单
    this.transferForm = this.formBuilder.group({
      address: [''],
      amount: [0, Validators.min(0)],
      gasPrice: [0]
    })
    // 获取token类型
    this.token = this.route.snapshot.paramMap.get('token') as TokenEnum
    // 获取当前钱包
    this.currentWallet = this.store.selectSnapshot(
      WalletState.getCurrentWallet
    ) as any
    // 获取交易实例
    this.transferInstance = Transfer.getTransfer(
      this.token,
      this.currentWallet.address,
      this.etherService
    )
    // 获取token信息
    this.getTokenInfo()
  }

  /**
   *  获取当前币种信息
   */
  private async getTokenInfo() {
    this.tokenInfo = await this.transferInstance.getBalance()
  }

  /**
   * 发送交易
   */
  private async onTransfer() {
    // 验证参数
    if (!this.transferForm.valid) {
      return
    }

    this.transferInstance
      .sendTransfer(this.currentWallet, {
        address: this.transferForm.value.address,
        amount: this.transferForm.value.amount
      })
      .subscribe(
        () => {
          this.commonService.toast('转账成功')
          this.location.back()
        },
        ex => {
          this.commonService.toast('转账失败')
        }
      )
  }
}

abstract class Transfer {
  /**
   * 获取对应的交易
   * @param token
   * @param address
   */
  public static getTransfer(token, address, etherService) {
    switch (token) {
      case TokenEnum.ETH:
        return new TransferETH(address, etherService)
      case TokenEnum.JCO:
        return new TransferToken(address, etherService)
      default:
        return new TransferETH(address, etherService)
    }
  }

  protected address
  protected etherService: EtherService

  constructor(address, etherService) {
    this.address = address
    this.etherService = etherService
  }

  public abstract getBalance(): Promise<IToken>
  public abstract sendTransfer(wallet, params: ITransferParams): Observable<any>
}

/**
 * ETH相关交易
 */
class TransferETH extends Transfer {
  constructor(address, etherService) {
    super(address, etherService)
    this.getBalance()
  }

  /**
   * 获取ETH余额
   */
  public getBalance() {
    return this.etherService.getEthInfo(this.address)
  }

  /**
   * 发送ETH交易
   * @param wallet
   * @param param1
   */
  public sendTransfer(wallet, { address, amount }: ITransferParams) {
    return this.etherService.sendETH(wallet, address, amount)
  }
}

/**
 * Token相关交易
 */
class TransferToken extends Transfer {
  constructor(address, etherService) {
    super(address, etherService)
  }

  /**
   * 获取Token金额
   */
  public getBalance() {
    return this.etherService.getTokenInfo(this.address)
  }

  /**
   * 发送Token交易
   * @param wallet
   * @param param1
   */
  public sendTransfer(
    wallet,
    { address, amount, gasPrice, remark }: ITransferParams
  ) {
    return this.etherService.sendToken(wallet, address, amount)
  }
}
