import { RouterModule, Routes } from '@angular/router';
import * as Guards from './guards';

import {
  AggregatorComponent,
  DetailsComponent,
  CoverComponent,
  PaymentComponent,
  NotFoundComponent,
  ExpiredComponent,
  RetrieveComponent,
  ConfirmationComponent } from './components';

export const routing:Routes = [{
  path:'',
  redirectTo:'details',
  pathMatch:'full'
}, {
  path:'details',
  data: { nav:true, name:'Details' },
  canDeactivate:[Guards.DeactivateGuard],
  canActivate:[Guards.ActivateGuard],
  component:DetailsComponent
}, {
  path:'cover',
  data: { nav:true, name:'Cover' },
  canDeactivate:[Guards.DeactivateGuard],
  canActivate:[Guards.CoverGuard, Guards.ActivateGuard],
  component:CoverComponent
}, {
  path:'payment',
  data: { nav:true, name:'Payment' },
  canDeactivate:[Guards.DeactivateGuard],
  canActivate:[Guards.PaymentGuard, Guards.ActivateGuard],
  component:PaymentComponent
}, {
  path:'confirmation',
  data: { nav:false, name:'Confirmation' },
  canDeactivate:[Guards.ConfirmationGuard],
  canActivate:[Guards.ConfirmationGuard, Guards.ActivateGuard],
  component:ConfirmationComponent
}, {
  path:'expired',
  component:ExpiredComponent
}, {
  path:'aggregator',
  data: { nav:false },
  component:AggregatorComponent,
  canActivate:[Guards.ActivateGuard],
}, {
  path:'retrieve-quote',
  component:RetrieveComponent,
  canActivate:[Guards.ActivateGuard]
}, {
  path: '**',
  component:NotFoundComponent
}];

export const routes = RouterModule.forRoot(routing);


// { path:'', data: { name:'Details' }, canActivate:[Guards.ActivateGuard], component:DetailsComponent },
// { path: '**', component: PageNotFoundComponent },
