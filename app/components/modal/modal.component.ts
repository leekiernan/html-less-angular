import { Component, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TimerService, WorkerService } from '../../services';

@Component({
  selector: 'modal',
  template: `
    <ng-template #content let-c="close" let-d="dismiss">
      <div class="modal-header" *ngIf="allowDismiss">
        <button type="button" class="close" aria-label="Close" (click)="d('Cross click')"><span aria-hidden="true">&times;</span></button>
      </div>

      <ng-content select=".modal-body"></ng-content>
    </ng-template>
  `,
  styles: [':host {}']
})
export class ModalComponent {
  public modal:NgbModalRef;
  @ViewChild('content') content:any;

  @Input() allowDismiss:boolean = false;
  @Input() show?:BehaviorSubject<boolean>;

  constructor(
    public ms:NgbModal,
    public ts:TimerService,
    public worker:WorkerService) {}

  ngOnInit() {
    if (!this.show) { return false; }
    this.show.subscribe( (v:boolean) => { !!v ?  this.open(this.content) :  this.close('v') });
  }

  open(content:any, opts?:any) {
    if (!this.content || !!this.modal) { return false; }

    this.modal = this.ms.open(content, opts);

    this.modal.result.then(
      (r:any) => {
        this.close(r);
        this.modal = null;
      }, (r:any) => {
        if (!this.allowDismiss) {
          this.close(r);
          this.open(this.content, opts);
        } else {
          this.modal = null;
        }
      }
    );
  }

  close(res?:any) {
    if (this.modal) {
      this.modal.close(res);
      this.modal = null;
    }
  }

  ngAfterViewInit() {
    this.ts.expired$.subscribe( (isTimedout:boolean) => {
      if (!!isTimedout) {
        this.close('timeout');
      }
    });
  }
}
