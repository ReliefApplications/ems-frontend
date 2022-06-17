import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapClorophletDivisionComponent } from './map-clorophlet-division.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SafeQueryBuilderModule } from '../../../../query-builder/query-builder.module';

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
    SafeQueryBuilderModule,
  ],
  exports: [MapClorophletDivisionComponent],
})
export class MapClorophletDivisionModule {}
