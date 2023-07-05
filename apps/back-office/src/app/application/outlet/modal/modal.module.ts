import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRoutingModule } from './modal-routing.module';
import { ModalComponent } from './modal.component';
import { ButtonModule, DialogModule as UiDialogModule } from '@oort-front/ui';
import { RouterOutlet } from '@angular/router';
import { DialogModule } from '@angular/cdk/dialog';
import { ModalWrapperComponent } from './modal-wrapper/modal-wrapper.component';

@NgModule({
  declarations: [ModalComponent, ModalWrapperComponent],
  imports: [
    CommonModule,
    ModalRoutingModule,
    UiDialogModule,
    RouterOutlet,
    DialogModule,
    ButtonModule,
  ],
  exports: [ModalComponent],
})
export class ModalModule {}
