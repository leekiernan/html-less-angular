import { Component, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TimerService, WorkerService } from '../../services';

import { ModalComponent } from './modal.component';

@Component({
  selector:'loader-modal',
  template:`
    <ng-template #content>
      <div class="loaders">
        <span class="loader loader-double"></span>
        &nbsp;
        <strong class="d-inline-block text-white">Loading</strong>
      </div>
    </ng-template>
  `,
  styles:[`:host {}`]
})
export class LoaderModalComponent extends ModalComponent {
  public modal:NgbModalRef;
  @Input() allowDismiss:boolean = false;

  constructor(
    public ms:NgbModal,
    public ts:TimerService,
    public worker:WorkerService) { super(ms, ts, worker); }

  ngOnInit() {
    // Listen for worker var - open or close loading modal
    // template is animated icon with backdrop.
    this.worker.loading.subscribe( (v:boolean) => {
      !!v ? this.open(this.content, { windowClass:'loading-modal' }) : this.close('finished loading')
    });

    return true;
  }
}
