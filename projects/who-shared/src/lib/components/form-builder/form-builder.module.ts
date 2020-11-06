import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoFormBuilderComponent } from './form-builder.component';
import { WhoFormModalModule } from '../form-modal/form-modal.module';

@NgModule({
  declarations: [WhoFormBuilderComponent],
  imports: [
    CommonModule,
    WhoFormModalModule
  ],
  exports: [WhoFormBuilderComponent]
})
export class WhoFormBuilderModule { }
