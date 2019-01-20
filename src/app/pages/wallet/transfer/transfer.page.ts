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
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.page.html',
  styleUrls: ['./transfer.page.scss']
})
export class TransferPage implements OnInit {
  // private toAddress: string
  // private fromAddress: string
  // private balance: string
  // private sendCount: string
  // private address: string
  // private password: string
  // private remark: string
  // private tokenName: string
  // private price: string
  // private sendAmount: string
  // private gasPrice: any
  // private gas: string
  // private gasAmount: string
  // private ethBalance: string

  //
  private transferInstance: Transfer
  private currentWallet: Wallet
  private token: TokenEnum
  private transferForm: FormGroup
  private tokenInfo: IToken
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private store: Store,
    private etherService: EtherService
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
  private onTransfer() {
    // 验证参数
    if (!this.transferForm.valid) {
      return
    }

    this.transferInstance.sendTransfer(this.currentWallet, {
      address: this.transferForm.value.address,
      amount: this.transferForm.value.amount,
      password: this.transferForm.value.password
      // gasPrice: this.transferForm.value.gasPrice,
      // remark: ''
    })
  }

  // calAmount() {
  //   this.sendAmount = this.etherService.calAmount(
  //     this.sendCount,
  //     parseFloat(this.price)
  //   )
  // }

  // calGas() {
  //   this.gas = this.etherService.calGas(this.gasPrice)
  //   this.gasAmount = (parseFloat(this.gas) * parseFloat(this.price)).toFixed(2)
  // }

  private send() {
    // let tx = {
    //   gasLimit: 250000,
    //   gasPrice: 90000,
    // };
    // let self = this
    // let loading = this.loadingCtrl.create({
    //   content: this.utilProvider.content
    // })
    // if (
    //   typeof this.toAddress !== 'string' ||
    //   !this.toAddress.match(/^[0-9A-Fa-f]{40}$/)
    // ) {
    //   this.utilProvider.message('地址不准确，请核对后再添加！', 3000)
    //   return
    // }
    // if (parseFloat(this.sendCount) > parseFloat(this.balance)) {
    //   this.utilProvider.message('转账数量超过当前余额！', 3000)
    //   return
    // }
    // this.utilProvider.showPromptAlert(
    //   '输入密码',
    //   'name',
    //   'password',
    //   (res: any) => {},
    //   (res: any) => {
    //     if (res == '' || res == null) {
    //       self.utilProvider.message('密码不能为空', 3000)
    //       return
    //     }
    //     this.password = res.name
    //     loading.present()
    //     if (this.tokenName !== this.utilProvider.tokenType.ETH) {
    //       this.etherService
    //         .sendTransaction(
    //           this.toAddress,
    //           this.sendCount,
    //           this.password,
    //           this.gasPrice,
    //           this.remark
    //         )
    //         .then(
    //           res => {
    //             this.utilProvider.message('转账成功！', 3000)
    //             loading.dismiss()
    //             self.navCtrl.push(TabsPage)
    //           },
    //           err => {
    //             this.utilProvider.message('转账失败！', 3000)
    //             loading.dismiss()
    //             console.log(err)
    //           }
    //         )
    //     } else {
    //       this.etherService
    //         .sendETH(this.toAddress, this.sendCount, this.password, this.remark)
    //         .then(
    //           res => {
    //             this.utilProvider.message('转账成功！', 3000)
    //             loading.dismiss()
    //             self.navCtrl.push(TabsPage)
    //           },
    //           err => {
    //             this.utilProvider.message('转账失败！', 3000)
    //             loading.dismiss()
    //             console.log(err)
    //           }
    //         )
    //     }
    //   }
    // )
  }

  private getAddress() {
    // this.navCtrl.push(AddressBookPage, {
    //   transfer: true,
    //   tokenName: this.tokenName
    // })
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
  public abstract sendTransfer(wallet, params: ITransferParams)
}

/**
 * ETH相关交易
 */
class TransferETH extends Transfer {
  constructor(address, etherService) {
    super(address, etherService)
    this.getBalance()
  }

  public getBalance() {
    return this.etherService.getEthInfo(this.address)
  }

  public sendTransfer(
    wallet,
    { address, amount, password, remark }: ITransferParams
  ) {
    return this.etherService.sendETH(address, amount, password, remark)
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
   * 获取TOKEN金额
   */
  public getBalance() {
    return this.etherService.getJcoInfo(this.address)
  }

  public sendTransfer(
    wallet,
    { address, amount, password, gasPrice, remark }: ITransferParams
  ) {
    return this.etherService.sendTransaction(
      wallet,
      address,
      amount,
      password
      // gasPrice,
      // remark
    )
  }
}
