import { Injectable, isDevMode } from '@angular/core'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { AmapGeocoderService, AmapGeocoderWrapper } from 'ngx-amap'
import { LoggerService } from '@ngx-toolkit/logger'
import { CommonService } from './common.service'
import { Store } from '@ngxs/store'
import {
  UpdateCityAction,
  UpdateAddressAction,
  UpdatePositionAction
} from 'app/store/action/location.action'
import coordtransform from 'coordtransform'

@Injectable()
export class DeviceService {
  private geoPromise: Promise<AmapGeocoderWrapper>
  constructor(
    private commomService: CommonService,
    private geolocation: Geolocation,
    private amapGeocoder: AmapGeocoderService,
    private store: Store,
    private logger: LoggerService
  ) {
    this.geoPromise = amapGeocoder.of({
      city: '010', // 城市，默认：“全国”
      radius: 1000, // 范围，默认：500
      extensions: ''
    })
  }

  /**
   * 获取当前坐标
   */
  public async getCurrentPosition(getAddress?: boolean) {
    try {
      const update = ({ coords }) => {
        const coordsToCj02 = coordtransform.wgs84togcj02(
          coords.longitude,
          coords.latitude
        )
        // 更新当前坐标
        this.updateCurrentPosition(coords)

        // 反向定位城市信息
        if (getAddress) {
          this.geoPromise
            .then(geocoder => geocoder.getAddress(coordsToCj02))
            .then(({ status, result }) => {
              if (status === 'complete' && result.info === 'OK') {
                const { formattedAddress, addressComponent } = result.regeocode
                // 更新城市
                this.store.dispatch(new UpdateCityAction(addressComponent.city))
                // 更新地址
                this.store.dispatch(new UpdateAddressAction(formattedAddress))
              }
            })
        }
      }

      // 用于测试位置
      if (isDevMode()) {
        return update({
          coords: {
            latitude: 34.194592654,
            longitude: 108.8808993124
          }
        })
      }

      // 获取坐标信息
      await this.geolocation
        .getCurrentPosition()
        .then(update)
        .catch(() => {
          navigator.geolocation.getCurrentPosition(update, () => 0, {
            enableHighAccuracy: true
          })
        })
    } catch (ex) {
      this.logger.error(ex)
      this.commomService.message('定位失败')
    }
  }

  private updateCurrentPosition(coords) {
    if (!coords) return
    this.store.dispatch(new UpdatePositionAction(coords))
  }
}
