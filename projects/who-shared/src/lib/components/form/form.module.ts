import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoFormComponent } from './form.component';

@NgModule({
  declarations: [WhoFormComponent],
  imports: [
    CommonModule
  ],
  exports: [WhoFormComponent]
})
export class WhoFormModule { }
