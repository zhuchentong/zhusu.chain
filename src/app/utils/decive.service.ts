import { Injectable } from '@angular/core'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { AmapGeocoderService, AmapGeocoderWrapper } from 'ngx-amap'
import { LoggerService } from '@ngx-toolkit/logger'
import { CommonService } from './common.service'
import { Store } from '@ngxs/store'
import { UpdateLocationAction } from 'app/store/action/location.action'
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
        this.updateCurrentPosition(coords)

        // 反向定位城市信息
        if (getAddress) {
          this.geoPromise
            .then(geocoder => geocoder.getAddress(coordsToCj02))
            .then(({ status, result }) => {
              if (status === 'complete' && result.info === 'OK') {
                const { formattedAddress, addressComponent } = result.regeocode
                this.store.dispatch(
                  new UpdateLocationAction({
                    city: addressComponent.city,
                    address: formattedAddress
                  })
                )
              }
            })
        }
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
    this.store.dispatch(
      new UpdateLocationAction({
        position: {
          latitude: coords.latitude,
          longitude: coords.longitude
        }
      })
    )
  }
}
