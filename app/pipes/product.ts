import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'product' })
export class ProductPipe implements PipeTransform {
  transform(value:any, args:string[]):any {
    switch(value) {
      case "Cat Extra":
      case "Dog Extra":
      case "Extra":
        return "Lifetime Extra";
      case "Cat Plus":
      case "Dog Plus":
      case "Plus":
        return "Lifetime Plus";
      case "Lifetime Value Cat":
      case "Lifetime Value Dog":
      case "Lifetime Value":
        return "Lifetime Value";
      case "PPL Condition Care Plus Cat":
      case "PPL Condition Care Plus Dog":
      case "PPL Condition Care Plus":
        return "Condition Care";
      case "PPL Time Care Essential Cat ":
      case "PPL Time Care Essential Dog":
      case "PPL Time Care Essential":
      case "PPL Time Care Plus Cat":
      case "PPL Time Care Plus Dog":
      case "PPL Time Care Plus":
        return "Time Care";
      default:
        return "";
    }
  }
}
