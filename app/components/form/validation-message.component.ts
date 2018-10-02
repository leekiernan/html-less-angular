import { Component, ContentChild, ContentChildren, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';


// validation-message
@Component({
  selector: 'validation-message',
  template: '<div *ngIf="show" class="form-control-feedback"><ng-content></ng-content></div>'
})
export class ValidationMessageComponent {
  @Input() public name: string;
  public show: boolean = false;

  showsErrorIncludedIn(errors:string[]):boolean {
    return errors.some(error => error === this.name);
  }
}

