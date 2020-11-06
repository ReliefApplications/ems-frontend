import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoMapComponent } from './map.component';

@NgModule({
  declarations: [WhoMapComponent],
  imports: [
    CommonModule
  ],
  exports: [WhoMapComponent]
})
export class WhoMapModule { }
