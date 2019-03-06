// 添加金币
export class AddCoin {
  public static readonly type = '[coin] AddCoin'
  constructor(public coins) {}
}

// 删除金币
export class RemoveCoin {
  public static readonly type = '[coin] RemoveCoin'
  constructor(public id) {
    return
  }
}

// 更新采集时间
export class UpdateCollectTime {
  public static readonly type = '[coin] UpdateCollectTime'
  constructor() {
    return
  }
}
