import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AddLayoutModalComponent } from './add-layout-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
