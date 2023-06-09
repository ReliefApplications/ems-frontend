import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerDatasourceComponent } from './layer-datasource.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeGraphQLSelectModule } from '../../../../graphql-select/graphql-select.module';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { SafeDividerModule } from '../../../../ui/divider/divider.module';
import { SafeBadgeModule } from '../../../../ui/badge/badge.module';
import {
  AlertModule,
  ButtonModule,
  TableModule,
  FormWrapperModule,
} from '@oort-front/ui';

/** Module for the LayerDatasourceComponent */
@NgModule({
  declarations: [LayerDatasourceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    SafeGraphQLSelectModule,
    SafeButtonModule,
    SafeDividerModule,
    TranslateModule,
    FormWrapperModule,
    SafeBadgeModule,
    TableModule,
    ButtonModule,
    AlertModule,
  ],
  exports: [LayerDatasourceComponent],
})
export class LayerDatasourceModule {}
