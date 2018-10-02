declare const window:any;
declare const moment:any;
declare const Date:any;
declare const dataLayer:any;

import { Component, Inject, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { getQueryStringValue } from '../../app.module';
import { APIService, environment, FormService, QuoteService, TimerService, WorkerService } from '../../services';

@Component({
  selector: 'confirmation-component',
  templateUrl: './confirmation.component.html',
  styles: ['.card { border-radius:0; border:1px solid #f7f7f7; }', '.policy-summary { color:black }']
})
export class ConfirmationComponent {
  // public data:
  public form:FormGroup;
  public purchaseData:any;
  private work:any;

  constructor(
    private _router:Router,
    private _title:Title,
    private worker:WorkerService,
    public api:APIService,
    public fs:FormService,
    public quote:QuoteService,
    public timer:TimerService) {

    _title.setTitle("Confirming your policy | PetProtect");
    this.form = fs.data;
    window.dataLayer = window.dataLayer || [];
  }

  ngOnInit() {
    this.work = this.worker.error.subscribe( (v:boolean) => {
      if (!!v) { this._router.navigate(['/details']); }
    });

    if (this.form.value.policies && this.form.value.policies.length) { return false; }

    let customer = getQueryStringValue('cid');
    if (customer) {
      // You can land on this page from the prev (/payment) or from the CC payment portal.
      // The latter have alreaedy paid when landing here.
      this.validate(customer);
    } else {
      this.buy();
    }
  }

  today() {
    const date = new Date();
    return {
      day:date.getUTCDate(),
      month:date.getUTCMonth() + 1,
      year:date.getUTCFullYear()
    };
  }
  renewal() {
    const dv = this.form.value.details.personal.coverStart;
    return {
      day: dv.day,
      month: dv.month,
      year: dv.year + 1
    };
  }

  async validate(cid:string) {
    let details = await this.quote.verify(cid);

    if (!details || !details.Orders) { return false; }
    this.form.get('payment.card').setValue(details.Orders);

    return this.buy('card');
  }

  buy(type?:string) {
    this.quote.buy(type || '').then((res) => {
      if (!res || !res.BuyPolicyResult) { return false; }

      this.gtm();
      this.form.get('policies').setValue(res.BuyPolicyResult.PolicyNumbers.string);
      this.purchaseData = res;
    });
  }


  gtm() {
    const toNumber = (price:number | string) => +Number(price).toFixed(2);
    let results = this.fs.data.value.details.pets.map(async (pet) => {
      return await this.api.get(`${environment.apiUrl}/breed/${pet.breed.name}`).toPromise();
    });

    // Look up each breed as we no longer store this...
    Promise.all(results).then( (pets:any) => {
      dataLayer.push({
        'event': 'transaction',
        'transactionId': Date.now(),
        'transactionAffiliation': this.fs.data.value.funnelPath,
        'transactionTotal': toNumber(this.quote.totalAnl()),
        'transactionProducts': this.fs.data.value.details.pets.map( (pet, indx) => {
          return {
            'sku': pet.gender,
            'name': this.quote.selected,
            'category': `${pet.type} - ${pet.breed.type} - ${pets[indx].name}`,
            'price': toNumber(this.quote.petPolicy(pet.name).price.annual),
            'quantity': 1
          }
        })
      });
    });

  }

  ngAfterViewChecked() {
    // Pausing the timer will
    //   - not kick people from the page
    //   - not warn them of any timeout
    //   - cause havoc if they refresh after 30 minutes of absense and send them to the generic /expired page.
    this.timer.pause();
  }

  ngOnDestroy() {
    this.work.unsubscribe();
  }

  feeCover() { return this.quote.policy(this.quote.selected, 'VetFeeCover'); }
  excess() { return this.quote.policy(this.quote.selected, 'Excess'); }
  policyTerms() { return this.quote.policyTerms(); }
  policySummary() { return this.quote.policySummary(); }
}
