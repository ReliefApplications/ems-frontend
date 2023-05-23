import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMarkerRuleComponent } from './map-marker-rule.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFilterModule } from '../../../../filter/filter.module';
import { ButtonModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';

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
    DialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SafeFilterModule,
    ButtonModule,
  ],
  exports: [MapMarkerRuleComponent],
})
export class MapMarkerRuleModule {}
