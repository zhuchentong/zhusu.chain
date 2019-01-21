import { Component, OnInit } from '@angular/core'
import {
  NavController,
  MenuController,
  LoadingController
} from '@ionic/angular'
import { EtherService } from 'app/utils/ether.service'
import { Wallet } from 'app/models/wallet.model'
import { Store } from '@ngxs/store'
import { WalletState } from 'app/store/state/wallet.state'
import { SetCurrentWalletAction } from 'app/store/action/wallet.action'
import { Location } from '@angular/common'
import { ClipboardService } from 'ngx-clipboard'
import { CommonService } from 'app/utils/common.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-wallet-change',
  templateUrl: './wallet-change.page.html',
  styleUrls: ['./wallet-change.page.scss']
})
export class WalletChangePage implements OnInit {
  private items: any = []
  private loading: any
  private walletList: Wallet[] = []
  private currentWallet
  private iscreate: boolean = false
  constructor(
    public navCtrl: NavController,
    public etherService: EtherService,
    public loadingCtrl: LoadingController,
    private store: Store,
    private router: Router,
    private location: Location,
    private menuController: MenuController,
    private commonService: CommonService,
    private clipboardService: ClipboardService
  ) {}

  public ngOnInit() {
    this.menuController.enable(true, 'menu')
  }

  private ionViewWillEnter() {
    // 获取钱包列表
    this.walletList = this.store.selectSnapshot(
      WalletState.getWalletList
    ) as any
    // 获取当前钱包
    this.currentWallet = this.store.selectSnapshot(
      WalletState.getCurrentWallet
    ) as any
  }

  /**
   * 设置当前钱包
   * @param wallet
   */
  private setCurrentWallet(wallet) {
    // 设置当前钱包
    this.store.dispatch(new SetCurrentWalletAction(wallet.address))
    // 更新当前钱包
    this.currentWallet = wallet
    this.location.back()
  }

  private onCopyAddress(wallet) {
    this.clipboardService.copyFromContent(wallet.address)
    this.commonService.toast('地址已复制到粘贴板')
  }

  private onRedirect(url) {
    this.router.navigate([url])
    this.menuController.close('menu')
  }

  // private updateInfo(address: string, selected: boolean) {

  // }

  // private deleteAddress(address: string) {
  //   const self = this
  //   // this.loading = this.loadingCtrl.create({
  //   //   content: this.utilProvider.content
  //   // })

  //   // this.utilProvider.showPromptAlert(
  //   //   '输入交易密码',
  //   //   'password',
  //   //   'password',
  //   //   (res: any) => {},
  //   //   (res: any) => {
  //   //     this.loading.present()
  //   //     this.etherService.exportWallet(address, res.password).then(
  //   //       (res: any) => {
  //   //         this.utilProvider.deleteAddress(address)
  //   //         self.initAddress()
  //   //         this.loading.dismiss()
  //   //         this.utilProvider.message('删除成功！', 3000)
  //   //         if (this.utilProvider.isFirstLogin()) {
  //   //           this.navCtrl.push(MainWalletPage)
  //   //         }
  //   //       },
  //   //       (err: any) => {
  //   //         console.log(err)
  //   //         this.loading.dismiss()
  //   //         this.utilProvider.message('密码错误！', 3000)
  //   //       }
  //   //     )
  //   //   }
  //   // )
  // }
}
