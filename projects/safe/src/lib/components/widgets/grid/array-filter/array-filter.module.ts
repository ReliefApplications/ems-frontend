import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeArrayFilterComponent } from './array-filter.component';

@NgModule({
  declarations: [
    SafeArrayFilterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SafeArrayFilterComponent]
})
export class SafeArrayFilterModule { }
