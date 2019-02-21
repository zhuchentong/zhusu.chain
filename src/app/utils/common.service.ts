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
import { isUndefined } from 'util'
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

  public async loading(message, params = {}) {
    const loading = await this.loadingController.create(params)
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
  public async modal({
    component,
    componentProps,
    options,
    callback
  }: {
    component
    componentProps?
    options?
    callback
  }) {
    const modal = await this.modalController.create({
      component,
      componentProps,
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

  public async showAlert(option) {
    const alert = await this.atrCtrl.create(option)
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
   * 去除对象空值
   * @param obj
   */
  public filterEmptyValue(obj) {
    Object.entries(obj).forEach(([key, value]) => {
      if (value === '' || value === undefined) {
        delete obj[key]
      }
    })
    return obj
  }
}
