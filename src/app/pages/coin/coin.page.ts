import { Component, OnInit, ElementRef } from '@angular/core'
import { Scene, Sprite, Label, Group } from 'spritejs'
import { Store } from '@ngxs/store'
import {
  UpdateCollectTime,
  AddCoin,
  RemoveCoin
} from 'app/store/action/coin.action'
import { CommonService } from 'app/utils/common.service'

const MIN_COIN_AMOUNT = 0.01
const MAX_COIN_AMOUNT = 0.0001
const EXPIRE_TIME = 30 * 60 * 1000
@Component({
  selector: 'app-coin',
  templateUrl: './coin.page.html',
  styleUrls: ['./coin.page.scss']
})
export class CoinPage implements OnInit {
  private layer
  private amount = 0.0 // TODO: 为提取总金额,需要从服务端获取
  private width = window.innerWidth * 2
  private height = 400 * 2
  private readonly maxCoinCount = 8
  private readonly createSpeed = 1000 * 3 // 金币生产速度(ms)
  private recordList = [
    {
      state: '提现',
      amount: '0.0233',
      time: new Date()
    },
    {
      state: '过期',
      amount: '0.0233',
      time: new Date()
    }
  ]

  constructor(
    private elementRef: ElementRef,
    private store: Store,
    private commonService: CommonService
  ) {}

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
    const coinList = this.store.selectSnapshot(state => state.coin.coinList)

    if (coinList && coinList.length > 0) {
      coinList.forEach(coin => this.createCoin(coin))
    }
  }

  /**
   * 检测是否需要创建金币
   */
  private addNewCoin() {
    const lastTime = this.store.selectSnapshot(state => state.coin.lastTime)
    const coinList = this.store.selectSnapshot(state => state.coin.coinList)
    // 计算应生成金币数量
    if (lastTime) {
      // 应生成金币数
      const count = Math.floor((Date.now() - lastTime) / this.createSpeed)
      // 实际生成金币数
      const addCount = Math.min(this.maxCoinCount - coinList.length, count)

      if (addCount > 0) {
        const addCoinList = Array.from(Array(addCount), () => ({
          id: 1,
          amount: this.commonService.getRandomNumber(
            MIN_COIN_AMOUNT,
            MAX_COIN_AMOUNT,
            5
          ),
          createTime: +new Date(),
          expireTime: +new Date() + EXPIRE_TIME
        }))
        addCoinList.forEach(coin => this.createCoin(coin))
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
  private createCoin(data) {
    const coin = new Sprite('/assets/image/coin/coin.png')
    const label = new Label('111')
    const group = new Group()
    const size = 80
    const x = this.commonService.getRandomNumber(size, this.width - size)
    const y = this.commonService.getRandomNumber(
      size * 2,
      this.height - size * 2
    )

    // 设置金币位置
    coin.attr({
      anchor: [0.5, 0.5],
      pos: [size / 2, size / 2],
      size: [size, size]
    })

    label.attr({
      anchor: [0.5, 0.5],
      pos: [size / 2, size + 20],
      font: 'bold 24px Arial',
      color: '#ffffff'
    })

    group.attr({
      anchor: [0.5, 0.5],
      pos: [x, y]
    })
    group.append(coin)
    group.append(label)
    group.data = data

    // 添加旋转动画
    const animate1 = coin.animate(
      [{ rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }],
      {
        duration: 6000,
        iterations: Infinity
      }
    )

    // 添加竖直动画
    const animate2 = group.animate([{ y: y + 10 }, { y: y - 10 }], {
      duration: 1000 + Math.random() * 1000,
      delay: Math.random() * 1000,
      fill: 'forwards',
      direction: 'alternate',
      iterations: Infinity,
      easing: 'ease-in-out'
    })

    // 添加金币点击处理
    group.on('touchstart', evt => {
      // 取消动画
      animate1.cancel(true)
      animate2.cancel(true)
      evt.stopDispatch()
      // 金币采集动画
      group
        .transition(0.8)
        .attr({
          pos: [this.width / 2, -100]
        })
        .then(() => this.collectCoin(group))
    })

    // 添加到图层
    this.layer.append(group)
  }

  /**
   * 采集金币
   * @param coin
   */
  private collectCoin(group) {
    const coin = group.data
    this.amount += coin.amount
    this.layer.remove(group)
    this.store.dispatch(new RemoveCoin(coin.id))
    // TODO: 调用后台收币
  }
}
