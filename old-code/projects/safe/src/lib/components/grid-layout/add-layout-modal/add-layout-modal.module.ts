import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AddLayoutModalComponent } from './add-layout-modal.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SafeModalModule } from '../../ui/modal/modal.module';
import { SafeGraphQLSelectModule } from '../../graphql-select/graphql-select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Module for the addLayout component
 */
@NgModule({
  declarations: [AddLayoutModalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    SafeButtonModule,
    SafeModalModule,
    SafeGraphQLSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [AddLayoutModalComponent],
})
export class AddLayoutModalModule {}
