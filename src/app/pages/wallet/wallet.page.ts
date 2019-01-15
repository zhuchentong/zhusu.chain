import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonService } from 'app/utils/common.service'
import { EtherService } from 'app/utils/ether.service'
import { LoadingController } from '@ionic/angular'
import { TokenEnum } from 'app/config/enum.config'
import { LoggerService } from '@ngx-toolkit/logger'

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss']
})
export class WalletPage implements OnInit {
  private allMoney: string
  private currentEthPrice: string
  private ethAmount: string
  private ethCount: string
  private tokenName: string
  private tokenCount: string
  private tokenPrice: string
  private tokenAmount: string
  private gasLimit: string
  private gasPrice: string
  private currentWallet: any = {}

  constructor(
    private commonService: CommonService,
    private etherService: EtherService,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService
  ) {
    this.commonService.from = this.route.snapshot.paramMap.get('from')
  }

  public ngOnInit() {
    // console.log(this.etherService)
    return
  }

  private ionViewWillEnter() {
    this.initData()
  }

  private async initData() {
    const loading = await this.loadingCtrl.create({
      message: this.commonService.content
    })
    loading.present()
    this.currentWallet = this.commonService.getCurrentWallet()
    this.logger.info(this.currentWallet)
    if (this.currentWallet.name !== '' && this.currentWallet.address !== '') {
      this.etherService
        .getEthInfo(this.currentWallet.address)
        .then((res: any) => {
          this.currentEthPrice = res.price
          this.ethAmount = res.amount
          this.ethCount = res.balance
          this.allMoney = parseFloat(res.amount).toString()
          // 获取合约信息，暂时注销
          this.etherService
            .getJcoInfo(this.currentWallet.address)
            .then((jco: any) => {
              this.tokenName = jco.name
              this.tokenCount = jco.balance
              this.tokenAmount = jco.amount
              this.tokenPrice = jco.price
              this.allMoney = (
                parseFloat(res.amount) + parseFloat(jco.amount)
              ).toString()
              loading.dismiss()
            })
        })
        .catch(res => {
          loading.dismiss()
          this.logger.error(res)
          this.commonService.message('加载失败！', 3000)
        })
    } else {
      loading.dismiss()
      this.tokenCount = '0'
      this.ethCount = '0'
      this.commonService.message('请添加钱包！', 3000)
    }
  }

  private sendToken(name: string) {
    this.router.navigate([
      '/wallet/transfer',
      {
        tokenName: name
      }
    ])
  }
  // ssda
  private transfer() {
    this.router.navigate([
      '/wallet/transfer',
      {
        tokenName: TokenEnum.JCO
      }
    ])
  }

  private recive() {
    this.router.navigate([
      '/wallet/receive',
      {
        recive: '1234'
      }
    ])
  }

  private wallInfo() {
    this.router.navigate([
      '/wallet/wallet-info',
      {
        walletInfo: '1234'
      }
    ])
  }

  private changeWallet() {
    this.router.navigate([
      '/wallet/change-wallet',
      {
        ChangeWalletPage: '1234'
      }
    ])
  }

  private recoveryWallet() {
    this.router.navigate([
      '/wallet/change-wallet',
      {
        iscreate: true
      }
    ])
  }
}
