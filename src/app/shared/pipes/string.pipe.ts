import { Pipe, PipeTransform } from '@angular/core'
import clone from 'lodash.clone'
import cloneDeep from 'lodash.clonedeep'

@Pipe({
  name: 'string'
})
export class StringPipe implements PipeTransform {
  public transform(value: any): any {
    if (value.toString) {
      return value.toString()
    } else {
      return `${value}`
    }
  }
}
