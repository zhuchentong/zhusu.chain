import { Injectable } from '@angular/core'
import { STOEnum, CurrencyEnum, TokenEnum } from 'app/config/enum.config'
import {
  ToastController,
  AlertController,
  ModalController
} from '@ionic/angular'
import { LoggerService } from '@ngx-toolkit/logger'
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public content = '请等待...'
  public from = 'tab'

  constructor(
    public toastCtrl: ToastController,
    public atrCtrl: AlertController,
    private logger: LoggerService,
    private modalController: ModalController
  ) {}

  public async message(message: string, duration: number = 3000) {
    const toast = await this.toastCtrl.create({
      message,
      duration
    })
    toast.present()
  }

  public async toast(message: string, duration: number = 3000) {
    const toast = await this.toastCtrl.create({
      message,
      duration
    })
    toast.present()
  }
  /**
   * 显示modal
   * @param component
   * @param options
   * @param callback
   */
  public async modal(component, options = {}, callback?) {
    const modal = await this.modalController.create({
      component,
      showBackdrop: true,
      backdropDismiss: true,
      ...options
    })

    if (callback) {
      modal.onDidDismiss().then(callback)
    }

    modal.present()
    return modal
  }

  public async showPromptAlert(
    title: string,
    textName: string,
    inputType: any,
    cancel: (data: any) => void,
    confirm: (data: any) => void
  ) {
    const alert = await this.atrCtrl.create({
      header: title,
      inputs: [
        {
          name: textName,
          placeholder: '单行输入',
          type: inputType
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: cancel
        },
        {
          text: '确定',
          handler: confirm
        }
      ]
    })
    alert.present()
  }

  public async showCommonAlert(
    title: string,
    subTitle: string,
    text: string,
    confirm: (data: any) => void
  ) {
    const alert = await this.atrCtrl.create({
      header: title,
      subHeader: subTitle,
      buttons: [
        {
          text,
          handler: confirm
        }
      ]
    })
    alert.present()
  }

  public checkPassword(password: string) {
    let result = false
    if (password === undefined) {
      this.message('密码不能位空！')
    } else if (password.length < 6) {
      this.message('密码不能位空！')
    } else {
      result = true
    }
    return result
    // else{
    //   //校验规则 只允许输入8-16位数字、字母
    //   var reg = /^[A-Za-z0-9]{6,16}$/;
    //   if(reg.test(password)){
    //     return true;
    //   }
    // }
  }

  /**
   * 检测手机号
   * @param phoneNo 手机号码
   */
  public checkPhoneNo(phoneNo: string) {
    const reg = /^[1][3,4,5,6,7,8][0-9]{9}$/
    const result = reg.test(phoneNo)

    if (!result) {
      this.message('手机号码错误，请核查！')
    }

    return result
  }

  /**
   * 判空处理
   * @param obj
   */
  public isEmpty(obj: any) {
    if (obj == null || typeof obj === 'string') {
      return true
    } else {
      return false
    }
  }

  /**
   * 操作 localStorage
   * TODO:如何用户清理了缓存怎么办
   */
  public isFirstLogin() {
    if (localStorage.length === 0) {
      return true
    } else if (localStorage.getItem(this.getCurrentUser()) == null) {
      return true
    } else {
      return false
    }
  }

  /**
   * 插入storage
   * @param key
   * @param value
   */
  public insertLocal(key: string, value: string) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, value)
    }
  }

  public setCurrency(value: string) {
    localStorage.setItem(STOEnum.currentCurrency, value)
  }

  public setDefaultCurrency() {
    localStorage.setItem(STOEnum.currentCurrency, CurrencyEnum.CNY)
  }

  public getCurrency() {
    return localStorage.getItem(STOEnum.currentCurrency)
  }

  public getCurrentWalletJson() {
    return this.parseWalletJson(this.getCurrentUser()).json
  }

  public insertLocalStorage(address: string, json: any, name: string) {
    let username = this.getCurrentUser()
    if (localStorage.getItem(address)) {
      const wallet = this.parseWalletJson(address)
      if (wallet.username.indexOf(username) < 0) {
        username = wallet.username + ',' + username
        name = wallet.name
      }
    }
    const data = {
      name,
      address,
      json,
      username
    }
    localStorage.setItem(address, JSON.stringify(data))
    localStorage.setItem(this.getCurrentUser(), JSON.stringify(data))
  }

  public deleteAddress(address: string) {
    const wallet = this.parseWalletJson(address)
    if (
      wallet.address === this.parseWalletJson(this.getCurrentUser()).address
    ) {
      localStorage.removeItem(address)
      localStorage.removeItem(this.getCurrentUser())
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) !== STOEnum.currentCurrency) {
          localStorage.setItem(
            this.getCurrentUser(),
            localStorage.getItem(localStorage.key(i))
          )
          return
        }
      }
    } else {
      localStorage.removeItem(address)
    }
  }

  public setCurrentWallet(address: string) {
    const wallet = this.parseWalletJson(address)
    localStorage.setItem(this.getCurrentUser(), JSON.stringify(wallet))
  }

  public getCurrentWallet() {
    const wallet = this.parseWalletJson(this.getCurrentUser())
    if (wallet) {
      return { name: wallet.name, address: wallet.address }
    } else {
      return { name: '', address: '' }
    }
  }

  public getWalletList(): any[] {
    const list: any[] = []
    const username = this.getCurrentUser()
    for (let i = 0; i < localStorage.length; i++) {
      // key(i)获得相应的键，再用getItem()方法获得对应的值
      if (localStorage.key(i).indexOf('0x') >= 0) {
        const wallet = this.parseWalletJson(localStorage.key(i))
        if (wallet.username.indexOf(username) >= 0) {
          list.push({
            name: wallet.name,
            address: wallet.address,
            selected: false
          })
        }
      }
    }
    return list
  }

  /**
   * 更新钱包名称
   * @param address
   * @param name
   */
  public updateWalletName(address: string, name: string) {
    const wallet = this.parseWalletJson(address)
    wallet.name = name
    localStorage.setItem(address, JSON.stringify(wallet))
  }

  /**
   * 设置token
   * @param accessToken
   * @param refreshToken
   */
  public setToken(accessToken: string, refreshToken: string) {
    sessionStorage.setItem('access_token', accessToken)
    sessionStorage.setItem('refresh_token', refreshToken)
  }

  public getCurrentUser(): any {
    return 'default' // sessionStorage.getItem("current_user")  //钱包无需登录，username保存的就是 current_user，hwh
  }

  public parseWalletJson(key: string) {
    const json = localStorage.getItem(key)
    let data: any
    if (json) {
      try {
        data = JSON.parse(json)
      } catch (error) {
        this.logger.error(error)
      }
    }
    return data
  }
}
