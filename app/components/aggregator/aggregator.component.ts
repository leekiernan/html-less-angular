import { Component, Inject, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { getQueryStringValue } from '../../app.module';
import { GetOnpageErrors, MarkFormErrors } from '../../guards';
import { FormService, TimerService } from '../../services';

interface Questions {
  tos:AbstractControl;
}
const FB = new FormBuilder();

@Component({
  selector: 'aggregator-component',
  templateUrl: './aggregator.component.html'
})

// This is a landing page from aggregagtor websites.
// We redirect and inject POST data as a GET request.
export class AggregatorComponent {
  public form = FB.group({
    tos:['', [Validators.required]],
  });
  public questions:Questions;

  constructor(
    private _router:Router,
    private _title:Title,
    private timer:TimerService) {

    _title.setTitle("PetProtect partners | PetProtect");

    this.questions = {
      tos: this.form.get('tos')
    }

    if (!getQueryStringValue('quote_id') || !getQueryStringValue('product')) {
      // redirect?
    }
  }

  ngAfterContentInit() { window.scrollTo(0, 0); }
  ngOnInit() {
    return this.timer.pause();
  }

  continue() {
    MarkFormErrors(this.form);

    // If no errors - load? redirect?
    GetOnpageErrors().then( (err:any) => {
      window.scrollTo(0, err.getBoundingClientRect().top + window.scrollY - 120);
      return false;
    }, (e) => this._router.navigate(['/details']) );
  }
}
