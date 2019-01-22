import { Component, OnInit, Input } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { Store } from '@ngxs/store'
import { WalletState } from 'app/store/state/wallet.state'
import { Wallet } from 'app/models/wallet.model'
import { ethers } from 'ethers'
import { EtherService } from 'app/utils/ether.service'
import { CommonService } from 'app/utils/common.service'
import { LoggerService } from '@ngx-toolkit/logger'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input()
  public amount = 100
  private walletList: Wallet[]
  private currentWallet: Wallet

  constructor(
    private store: Store,
    private etherService: EtherService,
    private modalController: ModalController,
    private commonService: CommonService,
    private logger: LoggerService
  ) {}

  public ngOnInit() {
    // 获取钱包列表
    this.walletList = this.store.selectSnapshot(
      WalletState.getWalletList
    )
    // 获取当前钱包
    const current = this.store.selectSnapshot(
      WalletState.getCurrentWallet
    )

    this.currentWallet = this.walletList.find(
      x => x.address === current.address
    )

    // 获取钱包余额
    this.getWalletBalance()
  }

  public async getWalletBalance() {
    const loading = await this.commonService.loading('获取钱包信息')
    const walletBalance = await Promise.all(
      this.walletList.map(wallet =>
        this.etherService.getTokenInfo(wallet.address)
      )
    )

    walletBalance.forEach(item => {
      const wallet = this.walletList.find(x => item.address === x.address)
      wallet.balance = item.balance.toNumber()
    })
    loading.dismiss()
  }

  /**
   * 支付转账
   */
  private async onSendToken() {
    if (this.currentWallet.balance < this.amount) {
      this.commonService.toast('余额不足')
      return
    }
    const owner = await this.etherService.getContractOwner()
    this.etherService
      .sendToken(this.currentWallet, owner, this.amount)
      .subscribe(
        ({ result: [result] }) => {
          const tx = result.hash
          this.logger.log(tx)
          this.modalController.dismiss(tx)
        },
        () => {
          this.commonService.toast('支付失败')
        }
      )
  }
}
