declare const moment:any;

import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'camelCase' })
export class CamelCasePipe implements PipeTransform {
  transform(value:any, args:string[]):any {
    return value.replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^./, (str:string) => str.toUpperCase() )
  }
}
