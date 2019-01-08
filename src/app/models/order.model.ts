import { Model } from 'app/models'
import { Expose, Type } from 'class-transformer'
import { User } from './user.model'

export class Order extends Model {
  // ID
  public id: number
}
