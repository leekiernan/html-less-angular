import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Http }           from '@angular/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { GetOnpageErrors, MarkFormErrors } from '../../../guards';

import { ApplicationService, environment, FormService, QuoteService, WorkerService } from '../../../services';

const DECIMAL_FIX = (num) => Math.round(num * 100) / 100

interface Questions {
  sortCode:AbstractControl;
  accountNo:AbstractControl;
  accountName:AbstractControl;
  bankName:AbstractControl;
}

@Component({
  selector: 'payment-debit-component',
  templateUrl: './debit.component.html',
  styleUrls: ['./debit.component.scss']
})

export class PaymentDebitComponent {
  @Input('group') public form:FormGroup;
  public bankLoading:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public bankLookup:boolean = false;
  public questions:Questions;
  public showDirectDebitGuarantee:BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private _http:Http,
    public app:ApplicationService,
    public fs:FormService,
    public quote:QuoteService,
    public ws:WorkerService) {}

  ngOnInit() {
    this.questions = {
      sortCode:this.form.get('payment.debit.sortCode'),
      accountNo:this.form.get('payment.debit.accountNo'),
      accountName:this.form.get('payment.debit.accountName'),
      bankName:this.form.get('payment.bankName')
    };
  }

  // This user is trying to pay by CC.
  // We create the body that we need, combine it within laravel, JWT it and send to the payment gateway.
  // Gateway returns a customer number, which we append to the URL when redirecting.
  async getUrlAndRedirect() {
    this.ws.loading.next(true);

    const requestBody = {
      "RedirectURL":environment.paymentReturnUrl,
      'Email':this.form.value.details.personal.email,
      'FirstName':this.form.value.details.personal.forename,
      'LastName':this.form.value.details.personal.surname,
      'PhoneNumber':this.form.value.details.personal.phone,
      'Address1': this.form.value.details.personal.address.house,
      'Address2': this.form.value.details.personal.address.street,
      'City': this.form.value.details.personal.address.county,
      'State': '',
      'ZipCode': this.form.value.details.personal.address.postcode,
      'CountryID': 3,
      'BillingFirstName':this.form.value.details.personal.forename,
      'BillingLastName':this.form.value.details.personal.surname,
      'BillingPhoneNumber':this.form.value.details.personal.phone,
      'BillingAddress1': this.form.value.details.personal.address.house,
      'BillingAddress2': this.form.value.details.personal.address.street,
      'BillingCity': this.form.value.details.personal.address.county,
      'BillingState': '',
      'BillingZipCode': this.form.value.details.personal.address.postcode,
      'BillingCountryID': 3,
      'DueTodayAmount': DECIMAL_FIX(this.quote.total('annual',this.form.value.cover.choice)),
      'OrderDescriptionText': String(DECIMAL_FIX(this.quote.total('annual',this.form.value.cover.choice))),
      'Orders': [{
        'OrderTotal': DECIMAL_FIX(this.quote.total('annual',this.form.value.cover.choice)),
        'DueTodayAmount': DECIMAL_FIX(this.quote.total('annual',this.form.value.cover.choice))
      }]
    };

    let customerID = await this._http.post(`${environment.apiUrl}/customers`, requestBody).toPromise();
    if (!customerID) { return this.ws.error.next(true); }

    let redirectTo = await this._http.get(`${environment.apiUrl}/payment-url`).toPromise();
    try {
      window.location.assign(`${redirectTo.json().url}/${environment.ccPaymentUrl}?customerid=${customerID.json()}`);
      this.ws.loading.next(false);
    } catch(e) {
      this.ws.error.next(true);
    }
  }

  // Before redirecting customer, we should check the fields that we require.
  // We don't need the whole page (direct debit), but we do need the details including pet info.
  // If no errors found, call redirect.
  payByCard() {
    MarkFormErrors(this.form.get('details'), 'details');
    GetOnpageErrors().then( (err:any) => {
      window.scrollTo(0, err.getBoundingClientRect().top + window.scrollY - 120);
      return false;
    }, (e) => this.getUrlAndRedirect());
  }

  // Pass SC/AN; returned data is long and messy but we only care that is valid and contains an owning bank.
  validateBank() {
    let dd = this.form.get('payment.debit');
    if (!dd.valid) {
      MarkFormErrors(dd, 'payment.debit');
      return false;
    }

    this.questions.bankName.setValue('');
    this.bankLookup = true;
    this.bankLoading.next(true);

    this._http.get(`${environment.apiUrl}/bank/${this.questions.sortCode.value.join('')}/account/${this.questions.accountNo.value}`)
    .map( (response:any) => response.json() )
    .finally(() => this.bankLoading.next(false))
    .subscribe( (json:any) => {
    	let err = (who:any) => {
        who.bankLookup = true;
        who.questions.bankName.markAsDirty();
        who.questions.bankName.setValue('');
        who.questions.bankName.updateValueAndValidity();
    	}

    	if (json.result !== "VALID" || !json.owningbank) { return err(this); }

      try {
        this.bankLookup = false;
        this.questions.bankName.setValue(json.owningbank);
        this.questions.bankName.updateValueAndValidity();
      } catch(e) {
      	err(this);
      }
    });

    return false;
  }
}
