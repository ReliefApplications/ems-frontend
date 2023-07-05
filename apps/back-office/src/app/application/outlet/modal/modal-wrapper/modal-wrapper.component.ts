import { Component, Inject, TemplateRef } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modal-wrapper',
  templateUrl: './modal-wrapper.component.html',
  styleUrls: ['./modal-wrapper.component.scss'],
})
export class ModalWrapperComponent {
  constructor(
    @Inject(DIALOG_DATA)
    public data: {
      content: TemplateRef<any>;
    },
    public dialogRef: DialogRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.dialogRef.closed.subscribe(() => {
      this.router.navigate(['./', { outlets: { modal: null } }], {
        relativeTo: this.activatedRoute,
        skipLocationChange: true,
      });
    });
  }
}
