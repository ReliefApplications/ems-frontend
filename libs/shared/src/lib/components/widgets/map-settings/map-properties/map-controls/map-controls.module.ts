import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapControlsComponent } from './map-controls.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ToggleModule,
  SelectMenuModule,
  FormWrapperModule,
} from '@oort-front/ui';

/**
 * Module of Map Controls of the Map Properties.
 */
@NgModule({
  declarations: [MapControlsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ToggleModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
  exports: [MapControlsComponent],
})
export class MapControlsModule {}
