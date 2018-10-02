declare const window:any;

import { Injectable }     from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// import { environment } from './';

@Injectable()
export class WorkerService {
  public loading:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public error:BehaviorSubject<boolean | string> = new BehaviorSubject(false);

  constructor() {
    window.workerService = window.workerService || [];
    window.workerService.push(this);

    // If whatever is loading fails, we want to show the error but we do not want to keep the loading
    // This way, error modal can be closed and customer can try again.
    this.error.subscribe( (v:boolean) => !!v ? this.loading.next(false) : null );
  }
}
