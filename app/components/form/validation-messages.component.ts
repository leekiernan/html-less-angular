import { Component, ContentChild, ContentChildren, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Form } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ValidationMessageComponent } from './validation-message.component';

// validation-messages
@Component({
  selector: 'validation-messages',
  template: `<div><ng-content></ng-content></div>`
})
export class ValidationMessagesComponent {
  @Input() for:FormControl;
  @ContentChildren(ValidationMessageComponent) errorMessages: QueryList<ValidationMessageComponent>;
  public valueChanged:Subscription;

  constructor(private _er:ElementRef) { }

getControlName(c: AbstractControl): string | null {
    const formGroup = c.parent.controls;
    return Object.keys(formGroup).find(name => c === formGroup[name]) || null;
}


  ngOnInit() {
    // Watch for changes on the form module field
    // Display the form error if exists
    // This only displays the first error, so we take that component and set show to true.
    this.valueChanged = this.for.valueChanges.subscribe((v:any) => {
      this.errorMessages.forEach( error => error.show = false);

      // if (this.for.invalid && this.for.dirty) {}
      if (this.for.invalid && this.for.dirty && this.for.errors) {
        // do we need to check the child elements?
        let formGroupName = this.getControlName(this.for);
        let elements = this._er.nativeElement.ownerDocument.querySelectorAll('[formGroupName="' + formGroupName + '"]');
        let valid = false;
        if(elements!=null && elements[0]!=undefined && elements[0].hasAttribute('notrequired')) {
          valid = true;
          // check all controls (children) to see if they are valid?
          let absFor = <AbstractControl> this.for;
          let contr = absFor.parent.controls[formGroupName].controls;
          let keyArr: any[] = Object.keys(contr);
          keyArr.forEach(function(key) {
            let childFormElement = contr[key];
            if(childFormElement.invalid) valid = false;
          });
          // if all the children are valid...
          if(valid) {
            // mark the form group as pristine, as this seems to allow it to be 'invalid' (why is it invalid when all it's children are valid?!) but not show an error
            this.for.markAsPristine();
          }
        }
        let firstErrorMessageComponent = this.errorMessages.find( error => error.showsErrorIncludedIn(Object.keys(this.for.errors)) );

        if (firstErrorMessageComponent && !valid) {
          firstErrorMessageComponent.show = true;
        }
      }
    });
  }

  ngOnDestroy() {
    this.valueChanged && this.valueChanged.unsubscribe();
  }
}
