import { Component, OnInit, ElementRef } from '@angular/core'
import { Scene, Sprite } from 'spritejs'
import { Store } from '@ngxs/store'
import {
  UpdateCollectTime,
  AddCoin,
  RemoveCoin
} from 'app/store/action/coin.action'

@Component({
  selector: 'app-coin',
  templateUrl: './coin.page.html',
  styleUrls: ['./coin.page.scss']
})
export class CoinPage implements OnInit {
  private layer
  private amount = 0.0 // TODO: 为提取总金额,需要从服务端获取
  private iconAmount = 0.01 // 单币金额
  private width = window.innerWidth * 2
  private height = (window.innerHeight - 56) * 2
  private readonly maxCoinCount = 8
  private readonly createSpeed = 3000 // 金币生产速度(ms)

  constructor(private elementRef: ElementRef, private store: Store) {}

  public ngOnInit() {
    this.createScene()
    this.addLastCoin()
  }

  public ionViewWillEnter() {
    this.addNewCoin()
  }

  /**
   *  添加历史coin
   */
  private addLastCoin() {
    const count = this.store.selectSnapshot(state => state.coin.coinCount)

    if (count > 0) {
      Array(count)
        .fill('')
        .forEach(() => this.createCoin())
    }
  }

  /**
   * 检测是否需要创建金币
   */
  private addNewCoin() {
    const lastTime = this.store.selectSnapshot(state => state.coin.lastTime)
    const lastCount = this.store.selectSnapshot(state => state.coin.coinCount)
    // 计算应生成金币数量
    if (lastTime) {
      // 应生成金币数
      const count = Math.floor((Date.now() - lastTime) / this.createSpeed)
      // 实际生成金币数
      const addCount = Math.min(this.maxCoinCount - lastCount, count)
      if (addCount > 0) {
        Array(addCount)
          .fill('')
          .forEach(() => this.createCoin())
        this.store.dispatch(new AddCoin(addCount))
      }
    }

    // 更新采集时间
    this.store.dispatch(new UpdateCollectTime())
  }

  /**
   * 创建场景
   */
  private createScene() {
    const sceneContainer = this.elementRef.nativeElement.querySelector('.scene')
    const scene = new Scene(sceneContainer, {
      viewport: [this.width / 2, this.height / 2],
      resolution: [this.width, this.height],
      stickMode: 'width'
    })

    this.layer = scene.layer()
  }

  /**
   * 创建金币
   * TODO:需要添加金币金额需要创建GROUP
   */
  private createCoin() {
    const coin = new Sprite('/assets/image/login_icon.png')
    const x = this.getRandomInt(100, this.width - 100)
    const y = this.getRandomInt(100, this.height - 100)

    // 设置金币位置
    coin.attr({
      anchor: [0.5, 0.5],
      pos: [x, y],
      size: [100, 100]
    })

    // 添加旋转动画
    const animate1 = coin.animate(
      [{ rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }],
      {
        duration: 6000,
        iterations: Infinity
      }
    )

    // 添加竖直动画
    const animate2 = coin.animate([{ y: y + 10 }, { y: y - 10 }], {
      duration: 1000 + Math.random() * 1000,
      delay: Math.random() * 1000,
      fill: 'forwards',
      direction: 'alternate',
      iterations: Infinity,
      easing: 'ease-in-out'
    })

    // 添加金币点击处理
    coin.on('touchstart', evt => {
      // 取消动画
      animate1.cancel(true)
      animate2.cancel(true)
      evt.stopDispatch()
      // 金币采集动画
      coin
        .transition(0.8)
        .attr({
          pos: [this.width / 2, -100]
        })
        .then(() => this.collectCoin(coin))
    })

    // 添加到图层
    this.layer.append(coin)
  }

  /**
   * 获取随机位置
   * @param min
   * @param max
   */
  private getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }

  /**
   * 采集金币
   * @param coin
   */
  private collectCoin(coin) {
    this.amount += this.iconAmount
    this.layer.remove(coin)
    this.store.dispatch(new RemoveCoin())
    // TODO: 调用后台收币
  }
}
