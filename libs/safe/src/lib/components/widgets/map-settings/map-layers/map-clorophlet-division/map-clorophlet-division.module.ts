import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapClorophletDivisionComponent } from './map-clorophlet-division.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeFilterModule } from '../../../../filter/filter.module';
import { ButtonModule } from '@oort-front/ui';

/**
 * Single Division of clorophlet configuration module.
 */
@NgModule({
  declarations: [MapClorophletDivisionComponent],
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
    ButtonModule,
  ],
  exports: [MapClorophletDivisionComponent],
})
export class MapClorophletDivisionModule {}
