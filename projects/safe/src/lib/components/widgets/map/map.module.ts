import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapComponent } from './map.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SafeMapComponent],
    imports: [
      CommonModule,
      TranslateModule
    ],
  exports: [SafeMapComponent]
})
export class SafeMapModule { }
