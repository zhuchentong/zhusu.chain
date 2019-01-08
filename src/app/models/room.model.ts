import { Model } from 'app/models'
import { Expose, Type } from 'class-transformer'
import { User } from './user.model'

export class Room extends Model {
  // ID
  public id: number
}
