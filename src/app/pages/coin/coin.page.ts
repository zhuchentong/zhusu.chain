import { Component, OnInit, ElementRef } from '@angular/core'
import { Scene, Sprite, Label } from 'spritejs'

@Component({
  selector: 'app-coin',
  templateUrl: './coin.page.html',
  styleUrls: ['./coin.page.scss']
})
export class CoinPage implements OnInit {
  private layer
  private amount = 0.0
  private readonly width = 360
  private readonly height = 720

  constructor(private elementRef: ElementRef) {}

  public ngOnInit() {
    return
  }

  public ngAfterContentInit() {
    this.createScene()
    this.checkCoin()
  }

  private checkCoin() {
    Array(4)
      .fill('')
      .forEach(() => this.createCoin())
  }

  /**
   *
   */
  private createScene() {
    const sceneContainer = this.elementRef.nativeElement.querySelector('.scene')
    const scene = new Scene(sceneContainer, {
      viewport: [this.width, this.height],
      resolution: [this.width, this.height],
      stickMode: 'width'
    })

    this.layer = scene.layer()
  }

  private createCoin() {
    const coin = new Sprite('/assets/image/login_icon.png')
    const x = this.getRandomInt(100, this.width - 100)
    const y = this.getRandomInt(100, this.height - 100)

    coin.attr({
      anchor: [0.5, 0.5],
      pos: [x, y],
      size: [50, 50]
    })

    coin.animate([{ rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }], {
      duration: 6000,
      iterations: Infinity
    })

    coin.animate(
      Math.random() > 0.5
        ? [{ x: x - 5 }, { x: x + 5 }]
        : [{ x: x + 5 }, { x: x - 5 }],
      {
        duration: 3000,
        fill: 'forwards',
        direction: 'alternate',
        iterations: Infinity,
        easing: 'ease-in-out'
      }
    )

    coin.on('touchstart', evt => {
      coin.transition(0.8).attr({
        pos: [this.width / 2, -100]
      })
      evt.stopDispatch()
      this.collectCoin()
    })

    this.layer.append(coin)
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }

  private collectCoin() {
    this.amount += 0.001
  }
}
