import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapControlsComponent } from './map-controls.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';

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
    MatSlideToggleModule,
    MatFormFieldModule,
  ],
  exports: [MapControlsComponent],
})
export class MapControlsModule {}
