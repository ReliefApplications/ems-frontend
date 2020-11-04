import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoFormBuilderComponent } from './form-builder.component';

@NgModule({
  declarations: [WhoFormBuilderComponent],
  imports: [
    CommonModule
  ],
  exports: [WhoFormBuilderComponent]
})
export class WhoFormBuilderModule { }
