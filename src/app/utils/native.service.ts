import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { Platform } from '@ionic/angular'
import { Injectable } from '@angular/core'

/**
 * 原生服务相关API
 */

@Injectable()
export class NativeService {
  constructor(
    private platform: Platform,
    private socialSharing: SocialSharing // private inAppBrowser: InAppBrowser
  ) {}

  /**
   * 调用系统分享功能
   * 同时只能分享一种类型
   * @param message 分享文本
   * @param file 分享文件，如图片
   */
  public share(message: string = null, file: string | string[] = null) {
    if (!this.isMobile()) {
      // this.alert('请使用真机调试')
      return
    }
    this.socialSharing.share(message, null, file)
  }

  /**
   * 判断是否是真机设备
   */
  public isMobile(): boolean {
    return this.platform.is('mobile') && this.platform.is('cordova')
  }

  /**
   * 是否android真机环境
   */
  public isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android')
  }

  /**
   * 是否ios真机环境
   */
  public isIos(): boolean {
    return (
      this.isMobile() &&
      (this.platform.is('ios') ||
        this.platform.is('ipad') ||
        this.platform.is('iphone'))
    )
  }
}
