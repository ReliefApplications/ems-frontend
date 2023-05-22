import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMarkersComponent } from './map-markers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeAlertModule } from '../../../../ui/alert/alert.module';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MapMarkerRuleModule } from '../map-marker-rule/map-marker-rule.module';
import { TooltipModule, IconModule } from '@oort-front/ui';

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
    SafeAlertModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MapMarkerRuleModule,
    TooltipModule,
    IconModule,
  ],
  exports: [MapMarkersComponent],
})
export class MapMarkersModule {}
