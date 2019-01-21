import { Injectable } from '@angular/core'
import { STOEnum, CurrencyEnum, TokenEnum } from 'app/config/enum.config'
import {
  ToastController,
  AlertController,
  ModalController,
  LoadingController
} from '@ionic/angular'
import { LoggerService } from '@ngx-toolkit/logger'
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Observable } from 'rxjs'
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
    private modalController: ModalController,
    private loadingController: LoadingController
  ) {
    // 添加dayjs扩展
    dayjs.extend(relativeTime)
  }

  /**
   * 格式化日期
   * @param date
   * @param format
   */
  public dateFormat(date, format = 'YYYY-MM-DD') {
    return dayjs(date).format(format)
  }

  /**
   * 将日期转换为dayjs
   * @param date
   */
  public dateParse(date) {
    return dayjs(date)
  }

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

  public async loading(message) {
    const loading = await this.loadingController.create()
    loading.message = message
    loading.present()
    return loading
  }
  /**
   * 返回基于Observable的Timeout
   * @param time
   */
  public setTimeoutObservable(time = 3000) {
    return Observable.create(observer => {
      setTimeout(observer.next, time)
    })
  }

  /**
   * 返回基于Observable的Interval
   * @param time
   */
  public setIntervalObservable(time = 1000) {
    let interval
    return Observable.create(observer => {
      interval = setInterval(
        observer.next(() => {
          clearInterval(interval)
          observer.complete()
        }),
        time
      )
    })
  }

  /**
   * 返回基于Observable的倒计时
   * @param time
   * @param step
   */
  public setCountdown(time = 10000, step = 1000) {
    let interval
    // 剩余时间
    let leftTime = time
    return Observable.create(observer => {
      interval = setInterval(() => {
        // 剩余时间
        leftTime = leftTime - step

        // 剩余时间小于0时停止
        if (leftTime <= 0) {
          observer.complete(leftTime)
          clearInterval(interval)
        } else {
          observer.next(leftTime)
        }
      }, step)
      // 返回剩余时间
      observer.next(leftTime, () => {
        clearInterval(interval)
      })
    }) as Observable<number>
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
    inputType: any
  ) {
    return new Promise(async (reslove, reject) => {
      const alert = await this.atrCtrl.create({
        header: title,
        inputs: [
          {
            name: textName,
            type: inputType
          }
        ],
        buttons: [
          {
            text: '取消',
            role: 'cancel',
            handler: (...args) => reject(args)
          },
          {
            text: '确定',
            handler: (...args) => reslove(args)
          }
        ]
      })
      alert.present()
    })
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
