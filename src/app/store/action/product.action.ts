import { Hotel } from 'app/models/hotel.model'

export class UpdateProductAction {
  public static readonly type = '[Product] UpdateProduct'
  constructor(public product: Hotel) {}
}
