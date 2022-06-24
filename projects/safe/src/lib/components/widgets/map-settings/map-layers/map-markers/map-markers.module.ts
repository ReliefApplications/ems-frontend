import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMarkersComponent } from './map-markers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeAlertModule } from '../../../../ui/alert/alert.module';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MapMarkerRuleModule } from '../map-marker-rule/map-marker-rule.module';

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
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MapMarkerRuleModule,
  ],
  exports: [MapMarkersComponent],
})
export class MapMarkersModule {}
