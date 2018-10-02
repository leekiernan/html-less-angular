import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'values' })
export class ValuesPipe implements PipeTransform {
  transform(value:any, args:string[]):any {
    return (<any>Object).values(value);
  }
}
