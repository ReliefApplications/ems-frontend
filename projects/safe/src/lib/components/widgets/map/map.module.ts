import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapComponent } from './map.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [SafeMapComponent],
    imports: [
        CommonModule,
        MatTooltipModule
    ],
  exports: [SafeMapComponent]
})
export class SafeMapModule { }
