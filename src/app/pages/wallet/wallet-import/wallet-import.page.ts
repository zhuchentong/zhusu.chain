import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Store } from '@ngxs/store'
import { UserState } from 'app/store/state/user.state'
import { WalletState } from 'app/store/state/wallet.state'
import { EtherService } from 'app/utils/ether.service'
import { CommonService } from 'app/utils/common.service'
import { Location } from '@angular/common'
import { Wallet } from 'app/models/wallet.model'
import { AddWalletAction } from 'app/store/action/wallet.action'
import { LoggerService } from '@ngx-toolkit/logger'

@Component({
  selector: 'app-wallet-import',
  templateUrl: './wallet-import.page.html',
  styleUrls: ['./wallet-import.page.scss']
})
export class WalletImportPage implements OnInit {
  private user
  private walletList
  private importForm: FormGroup

  constructor(
    private commonService: CommonService,
    private etherService: EtherService,
    private formBuilder: FormBuilder,
    private store: Store,
    private logger: LoggerService,
    private location: Location
  ) {}

  public ngOnInit() {
    this.user = this.store.selectSnapshot(UserState.user)
    this.walletList = this.store.selectSnapshot(WalletState.getWalletList)
    this.importForm = this.formBuilder.group({
      mnemonic: ['', Validators.required],
      password: ['', Validators.minLength(6)],
      repassword: ['', Validators.minLength(6)],
      confirm: [false, Validators.requiredTrue]
    })
  }

  /**
   * 导入助记词
   */
  private async onImport() {
    if (!this.importForm.valid) {
      return
    }

    if (
      this.importForm.value.mnemonic.split(/ /g).length !== 12 ||
      !this.etherService.checkMnemonic(this.importForm.value.mnemonic)
    ) {
      this.commonService.toast('请检查助记词!')
      return
    }

    if (this.importForm.value.password !== this.importForm.value.repassword) {
      this.commonService.toast('密码输入不一致！')
      return
    }

    const loading = await this.commonService.loading('正在导入钱包,请稍候...')
    this.etherService
      .importMnemonic(
        this.importForm.value.mnemonic,
        this.importForm.value.password
      )
      .then(({ wallet: etherWallet, encrypt }) => {
        const wallet = new Wallet()
        wallet.address = etherWallet.address
        wallet.name = this.createWalletName()
        wallet.user = this.user.id
        wallet.data = encrypt
        // 添加用户钱包
        this.store.dispatch(new AddWalletAction(wallet))
        this.commonService.toast('钱包导入成功')
        this.location.back()
      })
      .catch(error => {
        this.commonService.toast('钱包导入失败，请重试。', 3000)
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
      walletName += this.walletList.length
    }
    return walletName
  }
}
