import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapClorophletComponent } from './map-clorophlet.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { SliderModule } from '@oort-front/ui';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MapClorophletDivisionModule } from '../map-clorophlet-division/map-clorophlet-division.module';
import { SafeModalModule } from '../../../../ui/modal/modal.module';
import { ButtonModule } from '@oort-front/ui';

/**
 * Single Clorophlet Configuration in Map Settings Module.
 */
@NgModule({
  declarations: [MapClorophletComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    SliderModule,
    MatSelectModule,
    MapClorophletDivisionModule,
    SafeModalModule,
    ButtonModule,
  ],
  exports: [MapClorophletComponent],
})
export class MapClorophletModule {}
