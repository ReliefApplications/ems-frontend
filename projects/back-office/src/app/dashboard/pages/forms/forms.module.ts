import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';


@NgModule({
  declarations: [FormsComponent],
  imports: [
    CommonModule,
    FormsRoutingModule
  ],
  exports: [FormsComponent]
})
export class FormsModule { }
