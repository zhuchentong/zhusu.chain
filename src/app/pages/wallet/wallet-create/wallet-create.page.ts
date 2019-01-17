import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CommonService } from 'app/utils/common.service'
import { EtherService } from 'app/utils/ether.service'
import { LoggerService } from '@ngx-toolkit/logger'
import { Wallet } from 'app/models/wallet.model'
import { Store } from '@ngxs/store'
import { AddWalletAction } from 'app/store/action/wallet.action'
import { UserState } from 'app/store/state/user.state'
import { WalletState } from 'app/store/state/wallet.state'
import { Location } from '@angular/common'

@Component({
  selector: 'app-wallet-create',
  templateUrl: './wallet-create.page.html',
  styleUrls: ['./wallet-create.page.scss']
})
export class WalletCreatePage implements OnInit {
  private createForm: FormGroup
  private user
  private walletList
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private etherService: EtherService,
    private store: Store,
    private location: Location,
    private logger: LoggerService
  ) {
    return
  }

  public ngOnInit() {
    this.user = this.store.selectSnapshot(UserState.user)
    this.walletList = this.store.selectSnapshot(WalletState.getWalletList)
    this.createForm = this.formBuilder.group({
      password: ['', Validators.minLength(6)],
      repassword: ['', Validators.minLength(6)],
      confirm: [false, Validators.requiredTrue]
    })
  }

  /**
   * 创建钱包
   */
  private async onCreate() {
    if (!this.createForm.valid) return
    if (this.createForm.value.password !== this.createForm.value.repassword) {
      this.commonService.toast('两次输入密码不一致')
      return
    }
    const loading = await this.commonService.loading('正在创建钱包,请稍候...')

    this.etherService
      .createWallet(this.createForm.value.password)
      .then(({ wallet: etherWallet, encrypt }) => {
        const wallet = new Wallet()
        wallet.address = etherWallet.address
        wallet.name = this.createWalletName()
        wallet.user = this.user.id
        wallet.data = encrypt
        // 添加用户钱包
        this.store.dispatch(new AddWalletAction(wallet))
        this.commonService.toast('钱包添加成功')
        this.location.back()
      })
      .catch(error => {
        this.commonService.toast('创建钱包失败，请重试。', 3000)
        this.logger.error(error)
      })
      .finally(() => {
        loading.dismiss()
      })
  }

  /**
   * 生成钱包
   */
  private createWalletName() {
    let walletName = '我的钱包'
    if (this.walletList.length > 0) {
      walletName += this.walletList.length - 1
    }
    return walletName
  }
}
