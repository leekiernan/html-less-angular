import { NgModule }                          from '@angular/core';
import { CurrencyPipe }                      from '@angular/common';
import { BrowserModule, Title }              from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { HttpModule, JsonpModule }           from '@angular/http';
import { StoreModule, combineReducers }      from '@ngrx/store';
import { StoreDevtoolsModule }               from '@ngrx/store-devtools';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { SlickModule } from 'ngx-slick';

import * as Components                       from './components';
import * as Form                             from './form';
import * as Guards                           from './guards';
import * as Pipes                            from './pipes';
import * as Services                         from './services';
import * as Reducers                         from './reducers';
import { routes }                            from './app.routes';

import { DateParserFormatter }               from './providers/date-formatter';

export const useDateParserFormatter = () => new DateParserFormatter('DD/MM/YYYY');
export function expandKey(key:string) { return encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&"); }
export function getValueOfKey(key:string) { return new RegExp("^(?:.*[&\\?]"+expandKey(key)+"(?:\\=([^&]*))?)?.*$", 'i'); }
export function getQueryStringValue(key:string) { return decodeURIComponent(window.location.search.replace(getValueOfKey(key), "$1")); }

@NgModule({
  providers: [
    // provide is how we pull things into components via @Inject().  We use values pulled from the URL for most of these!
    { provide:NgbDateParserFormatter, useFactory:useDateParserFormatter },
    // { provide:'promo', useValue:getQueryStringValue('promo') },
    // { provide:'debug', useValue:getQueryStringValue('debug') },
    // { provide:'cid', useValue:getQueryStringValue('cid') },
    // { provide:'quoteID', useValue:getQueryStringValue('quote_id') },
    // { provide:'productID', useValue:getQueryStringValue('product') },
    // { provide:'utm_source', useValue:getQueryStringValue('utm_source') },
    CurrencyPipe,

    Form.FormModule,

    Services.APIService,
    Services.ApplicationService,
    Services.FormService,
    Services.NavigationService,
    Services.QuoteService,
    Services.TimerService,
    Services.WorkerService,

    Guards.ActivateGuard,
    Guards.ConfirmationGuard,
    Guards.CoverGuard,
    Guards.DeactivateGuard,
    Guards.PaymentGuard
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    ReactiveFormsModule,
    routes,
    StoreModule.forRoot({
      form:Reducers.formReducer,
      quote:Reducers.quoteReducer,
      timeout:Reducers.timeoutReducer
    }),
    // StoreDevtoolsModule.instrumentOnlyWithExtension({ maxAge:5 }),
    NgbModule.forRoot(),
    SlickModule.forRoot()
  ],

  declarations: [
    Components.AppComponent,
    Components.AggregatorComponent,
    Components.ExpiredComponent,
    Components.RetrieveComponent,
    Components.NotFoundComponent,

    Components.DebugComponent,
    Components.ModalComponent,
    Components.LoaderModalComponent,
    Components.ErrorModalComponent,
    Components.PromotionComponent,
    Components.PromotionRowComponent,
    Components.ReviewComponent,
    Components.ReviewsRowComponent,

    Components.DetailsComponent,
    Components.PersonalDetailsComponent,
    Components.PetDetailsComponent,
    Components.CoverComponent,
    Components.CoverOptionsComponent,
    Components.CoverSummaryComponent,
    Components.CoverOptionsDesktopComponent,
    Components.CoverOptionsMobileComponent,
    Components.PaymentComponent,
    Components.PreExistingConditionsComponent,
    Components.PreExistingTreatmentComponent,
    Components.QuoteSummaryComponent,
    Components.PaymentDetailsComponent,
    Components.PaymentDebitComponent,

    Components.ExtendedInputComponent,
    Components.ExtendedGroupComponent,
    Components.ValidationMessageComponent,
    Components.ValidationMessagesComponent,
    Components.ConfirmationComponent,

    Pipes.AgePipe,
    Pipes.CamelCasePipe,
    Pipes.DateToStringPipe,
    Pipes.FirstPipe,
    Pipes.KeysPipe,
    Pipes.PeriodPipe,
    Pipes.PetTitlePipe,
    Pipes.ProductPipe,
    Pipes.TruncatePipe,
    Pipes.ValuesPipe
  ],

  schemas: [],

  bootstrap: [Components.AppComponent]
})
export class AppModule { }
