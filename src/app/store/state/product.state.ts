import { State, Action, StateContext } from '@ngxs/store'
import { UpdateProductAction } from '../action/product.action'
import { Hotel } from 'app/models/hotel.model'

@State({
  name: 'product',
  defaults: {}
})
export class ProductState {
  @Action(UpdateProductAction)
  public update<T>(
    { setState }: StateContext<Hotel>,
    { product }: UpdateProductAction
  ) {
    setState(product)
  }
}
