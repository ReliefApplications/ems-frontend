import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapComponent } from './map.component';

@NgModule({
  declarations: [SafeMapComponent],
  imports: [
    CommonModule
  ],
  exports: [SafeMapComponent]
})
export class SafeMapModule { }
