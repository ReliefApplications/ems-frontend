import { Dialog } from '@angular/cdk/dialog';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ModalWrapperComponent } from './modal-wrapper/modal-wrapper.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @ViewChild('content')
  content!: TemplateRef<any>;

  constructor(private dialog: Dialog) {
    // this.dialog.open()
  }

  ngAfterViewInit() {
    console.log('initialize');
    this.dialog.open(ModalWrapperComponent, {
      data: {
        content: this.content,
      },
    });
  }
}
