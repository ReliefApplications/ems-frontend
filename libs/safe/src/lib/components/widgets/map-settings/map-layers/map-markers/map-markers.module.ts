import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMarkersComponent } from './map-markers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MapMarkerRuleModule } from '../map-marker-rule/map-marker-rule.module';
import {
  TooltipModule,
  ButtonModule,
  TableModule,
  AlertModule,
  SelectMenuModule,
} from '@oort-front/ui';

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
    SafeIconModule,
    MatFormFieldModule,
    MapMarkerRuleModule,
    TooltipModule,
    ButtonModule,
    TableModule,
    AlertModule,
    SelectMenuModule,
  ],
  exports: [MapMarkersComponent],
})
export class MapMarkersModule {}
