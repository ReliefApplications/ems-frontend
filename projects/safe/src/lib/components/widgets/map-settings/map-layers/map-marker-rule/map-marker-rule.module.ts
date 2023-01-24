import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMarkerRuleComponent } from './map-marker-rule.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFilterModule } from '../../../../filter/filter.module';

/**
 * Single Marker Rule configuration module.
 */
@NgModule({
  declarations: [MapMarkerRuleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SafeFilterModule,
  ],
  exports: [MapMarkerRuleComponent],
})
export class MapMarkerRuleModule {}
