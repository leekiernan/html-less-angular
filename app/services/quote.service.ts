declare const window:any;
declare const sessionStorage:any;

import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Form, Pet,
  PolicyQuote, PetQuote, Quote,
  NewQuotePolicyTerms, NewQuotePolicy, NewQuotePet, NewQuote
} from '../models';

import { ApplicationService, APIService, environment, FormService, NextIfValue, TimerService, WorkerService } from './';
import { QUOTE_CHANGED } from '../reducers/quote.reducer';

@Injectable()
export class QuoteService {
  public quoteReceived?:Quote | null;
  public data?:NewQuote | false;
  public quote:BehaviorSubject<Quote | null> = new BehaviorSubject(null);
  public selected:string;

  constructor(
    private app:ApplicationService,
    private api:APIService,
    private form:FormService,
    private timer:TimerService,
    private worker:WorkerService,
    private _currency:CurrencyPipe,
    private _store:Store<any>) {
    window.qs = this;
    this.selected = this.form.data.get('cover.choice').value;

    // We store the selection here and update when it changes.
    // We also add this to the form for each pet - this is required for our buy API call and we're already syncing.
    this.form.data.get('cover.choice').valueChanges.subscribe( (val:string) => {
      this.selected = val;

      if (!val || !this.data) { return false; }

      this.form.data.get('details.pets').value.forEach( (p,i) => {
        const policy = this.data && this.data.pets[p.name].policies[val];
        let select = {
          ProductId:policy.id,
          Excess:policy.excess,
          VoluntaryExcess:policy.voluntaryExcess,
          PolicyLimit:policy.policyLimit,
          CoInsurance:policy.coInsurance
        };
        this.form.data.get(`details.pets.${i}.selection`).setValue(select);
      });
    });

    // When we get a new quote, we:
    //   - store it.
    //   - keep the original
    //   - extract it as usable
    //   - grab the session ID required for purchase.
    this.quote.subscribe( (val?:Quote | null) => {
      this._store.dispatch({ type:QUOTE_CHANGED, payload:val });
      this.quoteReceived = val;

      if (val && !val.GetQuoteValuesResult) { return false; }

      this.data = val ? this.extractQuote(val) : null;
      this.form.data.get('SessionId').setValue(val && val.GetQuoteValuesResult.SessionId);
    });

    // Restore from sessionStorage if exists.
    var browserStorage;
    if (browserStorage = sessionStorage.getItem('quote')) {
      try {
        let browserStorageJSON = JSON.parse(browserStorage);
        this.quote.next(browserStorageJSON);
      } catch(e) { }
    }

    // On change, add to session.
    // This call is last in initialisation.
    _store.select('quote').subscribe( (quote:Quote) => {
      sessionStorage.setItem('quote', JSON.stringify(quote));
    });

    // Clear quote data if timer expires.
    timer.expired$.subscribe( v => {
      if (!!v) { this.clear(); }
    });
  }

  async get() {
    let response = await this.api.getQuote(this.form.data.value).toPromise();

    if (!response.GetQuoteValuesResult) {
      return this.worker.error.next('Response empty.'), false;
    }

    if (!response.GetQuoteValuesResult.Result) {
      return this.worker.error.next(
        (response.GetQuoteValuesResult.MessageList.ApiMessage && response.GetQuoteValuesResult.MessageList.ApiMessage.map( m => `${m.Code}: ${m.Message}. `)) || 'Error received.'
        ), false;
    }

    // API returning 200 with no policy info.  They should return error here but this is a workaround.
    const quotePolicies = response.GetQuoteValuesResult.PetPolicyList && response.GetQuoteValuesResult.PetPolicyList.PetPolicy;
    if (!quotePolicies || (typeof quotePolicies === 'object' && !quotePolicies.length)) {
      return this.worker.error.next('No policies received.'), false;
    }

    this.quote.next(response);
    return response;
  }

  async buy(type?:string) {
    let response = await this.api.buyPolicy(this.form.data.value, type || '').toPromise();

    if (!response.BuyPolicyResult) {
      // this.worker.error.next(true);
      this.worker.error.next('Response empty.');
    }
    return response;
  }
  async verify(id:string) {
    let response = await this.api.verifyPolicy(id).toPromise();
    return response;
  }

  // Update is a placeholder to run after pet removed at p2.
  // update() { this.api.getQuote(this.form.data.value).subscribe((quote:Quote) => this.quote.next(quote)); }
  update() { this.get(); }

  // We want to turn the API response into something better usable.
  // Memoise terms as they apply across all pets on policy - no need to look up multiple times.
  extractQuote(val) {
    if (!val || !val.GetQuoteValuesResult) { return false; }

    var quote:NewQuote = {
      pets: {},
      policies: {},
      session: val.GetQuoteValuesResult.SessionId
    };
    val.GetQuoteValuesResult.PetPolicyList.PetPolicy.forEach( (pet:PetQuote) => {
      let petName = pet.PetInfo.PetName;
      quote.pets[petName] = {
        policies: {}
      };

      pet.PolicyList.PolicyInfo.forEach((policy:PolicyQuote) => {
        let productName = policy.ProductName.replace(/[Cc]at|[Dd]og/g, '').trim();

        let getTerm = (term:string) => {
          let terms = policy.PolicyTerms.PolicyTerm;
          for (let i = terms.length - 1; i >= 0; i--) {
            if (terms[i].Description === term) { return terms[i].Value.replace('£',''); }
          }
          return '';
        };

        let terms:NewQuotePolicyTerms = {
          AdvertisingAndReward: getTerm('Recovery - Advertising and Reward up to'),
          Complimentary: getTerm('Alternative Therapy - Acupuncture up to'),
          DeathByAccident: getTerm('End of Life Services  - Accidental Death up to'),
          DietFood: getTerm('Food - Prescription Diets up to'),
          Euthanasia: getTerm('Euthanasia up to'),
          HolidayCancellation: getTerm('Holiday Cancellation up to'),
          KennelOrCatteryFees: getTerm('Kennel / Cattery Fees up to'),
          LossByTheftOfStraying: getTerm('Loss by Theft or Straying up to'),
          ThirdPartyLiability: getTerm('Third Party Liability up to'),
          TravelCover: getTerm('Travel Cover Vet Fees up to'),
          // VetFeeExcess: getTerm('Veterinary Fees - Accident and Illnesses excess'),
          VetFeeCover: getTerm('Veterinary Fees - Accident and Illnesses up to')
        };

        quote.pets[petName].policies[productName] = {
          id: policy.ProductId,
          excess: policy.Excess.Selected,
          voluntaryExcess:policy.VoluntaryExcess.Selected,
          policyLimit:policy.PolicyLimit.Selected,
          coInsurance:policy.CoInsurance.Selected,
          vetFees: policy.CoInsurance.Selected,
          price: {
            ipt: policy['IPT'],
            annual: policy.AnnualPremium,
            monthly:  {
              first: policy.FirstMonthly,
              rest: policy.RecurringMonthly
            }
          },
          terms: terms
        };

        quote.policies[productName] = terms;
      });
    });

    return quote;
  }
  // Ugly - ensure pet exists and return excess or 0.
  excess(pet:string) {
    return this.data &&
    this.data.pets[pet] &&
    this.data.pets[pet].policies[this.selected] &&
    this.data.pets[pet].policies[this.selected].excess || 0;
  }

  vetContribution(pet:string) {
    return +(this.data &&
          this.data.pets[pet] &&
          this.data.pets[pet].policies[this.selected] &&
          this.data.pets[pet].policies[this.selected].vetFees || 0) / 100;
  }

  price(pet:string, itvl:string) {
    if (!this.data || !this.data.pets[pet]) { return 0; }
    return itvl === 'annual' ? this.petPolicy(pet,this.selected).price.annual : this.petPolicy(pet,this.selected).price.monthly.rest;
  }

  total(itvl:string, policy?:string) {
    if (!this.data || !this.data.policies[policy || this.selected]) { return 0; }
    return itvl === 'annual' ? this.totalAnl(policy) : this.totalMth(policy);
  }
  petPolicy(pet:string, policy?:string) {
    return (this.data && this.data.pets[pet].policies[policy || this.selected]) ? this.data.pets[pet].policies[policy || this.selected] : {
      excess: 0,
      price: {
        ipt:0,
        annual:0,
        monthly: { rest:0, first:0 }
      }
    }
  }
  totalMth(policy?:string) {
    if (!this.data || !this.data.policies[policy || this.selected]) { return 0; }

    let pets = Object.keys(this.data.pets);
    return pets.map( (pn:string) => Number(this.petPolicy(pn,policy).price.monthly.rest) )
    .reduce((acc:number, cv:number) => acc + cv);
  }
  totalAnl(policy?:string) {
    if (!this.data || !this.data.policies[policy || this.selected]) { return 0; }

    let pets = Object.keys(this.data.pets);
    return pets.map( (pn:string) => Number(this.petPolicy(pn,policy).price.annual) )
    .reduce((acc:number, cv:number) => acc + cv);
  }
  tax() {
    if (!this.data) { return 0; }

    let pets = Object.keys(this.data.pets);
    return pets.map((pn:string) => Number(this.petPolicy(pn,this.selected).price.ipt))
    .reduce((acc:number, cv:number) => acc + cv);
  }
  displayCover(output:string) {
    return !!parseInt(output) ? this._currency.transform(output, 'GBP', true, '1.0-0') : output;
  }
  policy(policy:string, cover:string) {
    return this.data && this.data.policies[policy] && this.data.policies[policy][cover] ?
    this.displayCover(this.data.policies[policy][cover]) :
    '-';
  }

  clear() { this.quote.next(null); }

  policyTerms(policy?:string) {
    const link = `${this.app.brochureUrl}/wp-content/uploads/pdf`;
    switch(policy || this.selected) {
      case "Cat Extra":
      case "Dog Extra":
      case "Extra":
      case "Cat Plus":
      case "Dog Plus":
      case "Plus":
        return `${link}/tcs-pet-protect-lifetime-plus-extra.pdf`;
      case "PPL Condition Care Plus Cat":
      case "PPL Condition Care Plus Dog":
      case "PPL Condition Care Plus":
      case "PPL Time Care Essential Cat ":
      case "PPL Time Care Essential Dog":
      case "PPL Time Care Essential":
      case "PPL Time Care Plus Cat":
      case "PPL Time Care Plus Dog":
      case "PPL Time Care Plus":
        return `${link}/tcs-pet-protect-time-condition-care.pdf`;
      default: return '';
    }
  }

  policySummary(policy?:string) {
    const link = `${this.app.brochureUrl}/wp-content/uploads/pdf`;
    switch(policy || this.selected) {
      case "Cat Extra":
      case "Dog Extra":
      case "Extra":
      case "Cat Plus":
      case "Dog Plus":
      case "Plus":
        return `${link}/summary-pet-protect-lifetime-plus-extra.pdf`;
      case "PPL Condition Care Plus Cat":
      case "PPL Condition Care Plus Dog":
      case "PPL Condition Care Plus":
      case "PPL Time Care Essential Cat ":
      case "PPL Time Care Essential Dog":
      case "PPL Time Care Essential":
      case "PPL Time Care Plus Cat":
      case "PPL Time Care Plus Dog":
      case "PPL Time Care Plus":
        return `${link}/summary-pet-protect-time-condition-care.pdf`;
      default: return '';
    }
  }
}
