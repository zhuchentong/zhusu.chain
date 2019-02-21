import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonService } from 'app/utils/common.service'
import { EtherService } from 'app/utils/ether.service'
import { LoadingController } from '@ionic/angular'
import { TokenEnum } from 'app/config/enum.config'
import { LoggerService } from '@ngx-toolkit/logger'
import { Store } from '@ngxs/store'
import { WalletState } from 'app/store/state/wallet.state'
import { Wallet } from 'app/models/wallet.model'
import { IToken } from 'app/config/interface.config'
import { ClipboardService } from 'ngx-clipboard'

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss']
})
export class WalletPage implements OnInit {
  private wallet: Wallet // 当前用户钱包
  private walletOfETH: IToken
  private walletOfToken: IToken

  constructor(
    private etherService: EtherService,
    private store: Store,
    private router: Router,
    private logger: LoggerService,
    private clipboardService: ClipboardService,
    private commonService: CommonService
  ) {}

  public ngOnInit() {
    return
  }

  /**
   * 进入页面获取当前钱包
   */
  private ionViewWillEnter() {
    this.wallet = this.store.selectSnapshot(WalletState.getCurrentWallet())
    if (this.wallet) {
      this.getWalletAmount()
    } else {
      //  TODO:跳转到创建钱包
      this.onChangeWallet(true)
    }
  }

  /**
   * 获取钱包金额
   */
  private async getWalletAmount() {
    const loading = await this.commonService.loading('获取钱包信息，请稍候...')
    Promise.all([
      // 获取ETH信息
      this.etherService.getEthInfo(this.wallet.address),
      // 获取TOKEN信息
      this.etherService.getTokenInfo(this.wallet.address)
    ])
      .then(([eth, token]) => {
        this.walletOfETH = eth
        this.walletOfToken = token
      })
      .catch(() => {
        this.commonService.toast('获取钱包失败')
      })
      .finally(() => {
        loading.dismiss()
      })
  }

  private onCopyAddress() {
    this.clipboardService.copyFromContent(this.wallet.address)
    this.commonService.toast('地址已复制到粘贴板')
  }

  private onChangeWallet(replaceUrl) {
    this.router.navigate(['/wallet/wallet-change'], {
      replaceUrl
    })
  }
}
