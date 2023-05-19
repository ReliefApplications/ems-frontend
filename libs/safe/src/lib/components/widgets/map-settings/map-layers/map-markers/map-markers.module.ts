import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMarkersComponent } from './map-markers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeAlertModule } from '../../../../ui/alert/alert.module';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MapMarkerRuleModule } from '../map-marker-rule/map-marker-rule.module';
import { TooltipModule, TableModule } from '@oort-front/ui';

/**
 * Module of Map Widget marker rules.
 */
@NgModule({
  declarations: [MapMarkersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SafeButtonModule,
    SafeIconModule,
    SafeAlertModule,
    MatFormFieldModule,
    MatSelectModule,
    MapMarkerRuleModule,
    TooltipModule,
    TableModule,
  ],
  exports: [MapMarkersComponent],
})
export class MapMarkersModule {}
