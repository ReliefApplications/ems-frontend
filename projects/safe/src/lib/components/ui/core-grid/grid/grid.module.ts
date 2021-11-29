import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridComponent } from './grid.component';

@NgModule({
  declarations: [
    SafeGridComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SafeGridComponent
  ]
})
export class SafeGridModule { }
