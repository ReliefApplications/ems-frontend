import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMarkerRuleComponent } from './map-marker-rule.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFilterModule } from '../../../../filter/filter.module';
import { ButtonModule, DialogModule, FormWrapperModule } from '@oort-front/ui';

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
    FormWrapperModule,
    SafeFilterModule,
    ButtonModule,
  ],
  exports: [MapMarkerRuleComponent],
})
export class MapMarkerRuleModule {}
