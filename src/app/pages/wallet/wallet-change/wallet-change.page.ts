import { Component, OnInit } from '@angular/core'
import {
  NavController,
  NavParams,
  MenuController,
  LoadingController
} from '@ionic/angular'
import { EtherService } from 'app/utils/ether.service'
import { Wallet } from 'app/models/wallet.model'
import { Store } from '@ngxs/store'
import { WalletState } from 'app/store/state/wallet.state'
import { SetCurrentWalletAction } from 'app/store/action/wallet.action'

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
    private menuController: MenuController // public utilProvider: UtilProvider
  ) {}

  public ngOnInit() {
    return
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
  }

  private updateInfo(address: string, selected: boolean) {
    const self = this
    // this.utilProvider.showPromptAlert(
    //   '输入姓名',
    //   'name',
    //   'text',
    //   (res: any) => {},
    //   (res: any) => {
    //     if (res == '' || res == null) {
    //       self.utilProvider.message('姓名不能为空', 3000)
    //       return
    //     }
    //     if (res.name.length > 10) {
    //       self.utilProvider.message('姓名不能超过10个字', 3000)
    //       return
    //     }
    //     self.utilProvider.updateWalletName(address, res.name)
    //     this.initAddress()
    //     localStorage.removeItem(this.utilProvider.getCurrentUser())
    //     localStorage.setItem(
    //       this.utilProvider.getCurrentUser(),
    //       localStorage.getItem(address)
    //     )
    //     this.utilProvider.message('修改成功！', 3000)
    //   }
    // )
  }

  private deleteAddress(address: string) {
    const self = this
    // this.loading = this.loadingCtrl.create({
    //   content: this.utilProvider.content
    // })

    // this.utilProvider.showPromptAlert(
    //   '输入交易密码',
    //   'password',
    //   'password',
    //   (res: any) => {},
    //   (res: any) => {
    //     this.loading.present()
    //     this.etherService.exportWallet(address, res.password).then(
    //       (res: any) => {
    //         this.utilProvider.deleteAddress(address)
    //         self.initAddress()
    //         this.loading.dismiss()
    //         this.utilProvider.message('删除成功！', 3000)
    //         if (this.utilProvider.isFirstLogin()) {
    //           this.navCtrl.push(MainWalletPage)
    //         }
    //       },
    //       (err: any) => {
    //         console.log(err)
    //         this.loading.dismiss()
    //         this.utilProvider.message('密码错误！', 3000)
    //       }
    //     )
    //   }
    // )
  }
}
