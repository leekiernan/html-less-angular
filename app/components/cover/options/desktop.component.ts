import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormArray } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApplicationService, FormService, QuoteService } from '../../../services';


@Component({
  selector: 'cover-desktop-component',
  templateUrl: './desktop.component.html',
  styleUrls: ['./cover-options.component.scss']
})
export class CoverOptionsDesktopComponent {
  public choice:any;
  public form:FormGroup;
  public info?:{ [cover:string]: string } = null;
  public name:string = "Cover";
  public pets:FormGroup;
  public vetFeeCover:any;

  constructor(private modalService:NgbModal, public fs:FormService, public quote:QuoteService, public app:ApplicationService) {
    this.form = <FormGroup>fs.data.get('cover');
    this.pets = <FormGroup>fs.data.get('details.pets');
  }

  ngOnInit() {
    this.choice = this.form.value.choice;
    this.vetFeeCover = this.form.value.vetFeeCover;
    this.form.get('vetFeeCover').valueChanges.subscribe( (v:string) => this.vetFeeCover = v );
    this.form.get('choice').valueChanges.subscribe( (v:string) => this.choice = v );

    setInterval( () => {
      // this.testr.next(!this.testr.getValue());
    }, 4000);
  }

  toggle(cover:string) {
    const options = {
      coverTimeCare: `Time Care: Provides cover for your pets veterinary treatment including fees from the date of accident or illness up to the benefit level or for 12 months. To take advantage of the benefit limit, your policy must be continually renewed and in force during the period of treatment and after the benefit limit or 12 months is reached, which ever come sooner, after which treatment for that accident will be excluded from cover for the remainder of the policys life. Please see the <a href="${this.app.brochureUrl}/existing-customers/policy-documents/">Policy Summary and Policy Document</a> for full details.`,
      coverConditionCare: `ConditionCare; Provides cover for each new accident or illness up to the benefit level. To take advantage of the benefit limit per illness, your policy must be continually renewed and in force during the period of treatment and after the benefit limit is reached, after which treatment for that accident will be excluded from cover for the remainder of the policys life. Please see the <a href="${this.app.brochureUrl}/existing-customers/policy-documents/">Policy Summary and Policy Document</a> for full details.`,
      coverLifetimeValue: `Lifetime care: Provides an annual benefit limit per condition or for all conditions per annum, the limit reinstated at renewal. We pay as long as your pet needs the treatment. All limits are subject to renewing the policy and limits may apply for specific conditions. Your pet can be covered for an on-going condition in future years as long as the insurance policy remains in force with us. Please see the <a href="${this.app.brochureUrl}/existing-customers/policy-documents/">Policy Summary and Policy Document</a> for full details. Personalise your cover to 4k or 6k.`,
      coverLifetimePlus: `Lifetime care: Provides an annual benefit limit per condition or for all conditions per annum, the limit reinstated at renewal. We pay as long as your pet needs the treatment. All limits are subject to renewing the policy and limits may apply for specific conditions. Your pet can be covered for an on-going condition in future years as long as the insurance policy remains in force with us. Please see the <a href="${this.app.brochureUrl}/existing-customers/policy-documents/">Policy Summary and Policy Document</a> for full details. Personalise your cover to 4k or 6k.`,
      coverLifetimeExtra: `Lifetime care: Provides an annual benefit limit per condition or for all conditions per annum, the limit reinstated at renewal. We pay as long as your pet needs the treatment. All limits are subject to renewing the policy and limits may apply for specific conditions. Your pet can be covered for an on-going condition in future years as long as the insurance policy remains in force with us. Please see the <a href="${this.app.brochureUrl}/existing-customers/policy-documents/">Policy Summary and Policy Document</a> for full details. Personalise your cover to 4k or 6k`
    };

    this.info = this.info && this.info[cover] ? null : { [cover]: options[cover] };
  }
}
