import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapComponent } from './map.component';
import { LayoutModule } from '@progress/kendo-angular-layout';

@NgModule({
  declarations: [SafeMapComponent],
    imports: [
      CommonModule,
      LayoutModule
    ],
  exports: [SafeMapComponent]
})
export class SafeMapModule { }
