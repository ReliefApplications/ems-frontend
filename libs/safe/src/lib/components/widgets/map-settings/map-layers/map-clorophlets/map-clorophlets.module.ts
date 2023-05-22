import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapClorophletsComponent } from './map-clorophlets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { SafeAlertModule } from '../../../../ui/alert/alert.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MapClorophletModule } from '../map-clorophlet/map-clorophlet.module';
import { IconModule } from '@oort-front/ui';

/**
 * List of clorophlets in Map Settings Module.
 */
@NgModule({
  declarations: [MapClorophletsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SafeButtonModule,
    IconModule,
    SafeAlertModule,
    MatTableModule,
    MapClorophletModule,
  ],
  exports: [MapClorophletsComponent],
})
export class MapClorophletsModule {}
