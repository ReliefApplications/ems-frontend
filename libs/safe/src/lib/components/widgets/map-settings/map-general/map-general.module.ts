import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapGeneralComponent } from './map-general.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import {
  AlertModule,
  FormWrapperModule,
  GraphQLSelectModule,
} from '@oort-front/ui';

/**
 * Module of General settings of map widget
 */
@NgModule({
  declarations: [MapGeneralComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    FormWrapperModule,
    SafeQueryBuilderModule,
    GraphQLSelectModule,
    AlertModule,
  ],
  exports: [MapGeneralComponent],
})
export class MapGeneralModule {}
