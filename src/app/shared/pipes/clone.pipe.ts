import { Pipe, PipeTransform } from '@angular/core'
import clone from 'lodash.clone'
import cloneDeep from 'lodash.clonedeep'

@Pipe({
  name: 'clone'
})
export class ClonePipe implements PipeTransform {
  public transform(value: any, args = 'shallow'): any {
    switch (args) {
      case 'shallow':
        return clone(value)
      case 'deep':
        return cloneDeep(value)
      default:
        return clone(value)
    }
  }
}
