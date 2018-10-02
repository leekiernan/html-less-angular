import { Component, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { TimerService, WorkerService } from '../../services';

import { ModalComponent } from './modal.component';

@Component({
  selector:'error-modal',
  template:`
    <ng-template #content>
      <div class="modal-body">
        <p class=""><i class="h1 text-primary icon icon-exclamation-triangle"></i></p>

        <p class="lead">Something went wrong.</p>
        <p>We're having some trouble with your request. Please try again. If the problem persists, please try again later.</p>

        <pre *ngIf="errorIsString()"><textarea>{{ worker.error.getValue() }}</textarea></pre>

        <div class="btn-group btn-group-horizontal mt-4">
          <button class="btn btn-warning" (click)="dismiss()">Close</button>
        </div>
      </div>
    </ng-template>
  `,
  styles:[':host { }']
})
export class ErrorModalComponent extends ModalComponent {
  public modal:NgbModalRef;

  @Input() allowDismiss:boolean = true;

  constructor(
    public ms:NgbModal,
    public ts:TimerService,
    public worker:WorkerService) { super(ms, ts, worker); }

  dismiss() {
    this.worker.error.next(false);
  }

  errorIsString() {
    return typeof this.worker.error.getValue() === 'string';
  }

  ngOnInit() {
    this.worker.error.subscribe( (v:boolean) => { !!v ? this.open(this.content, { windowClass:'error-modal' }) : this.close('finished error') })
    return true;
  }
}
