import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export { ApplicationService } from './application.service';
export { WorkerService } from './worker.service';
export { APIService } from './api.service';
export { NavigationService } from './navigation.service';
export { TimerService } from './timer.service';
export { FormService } from './form.service';
export { QuoteService } from './quote.service';

export { environment } from '../../environments/environment';


export function NextIfValue(subject:BehaviorSubject<boolean>, value:boolean) {
  if (subject.getValue() !== value) { subject.next(value); }
}
