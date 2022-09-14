import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AddLayoutComponent } from './add-layout.component';
import { MatButtonModule } from '@angular/material/button';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafeLayoutModule } from '../../layout/layout.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SafeModalModule } from '../../ui/modal/modal.module';
import { SafeGraphQLSelectModule } from '../../graphql-select/graphql-select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Module for the addLayout component
 */
@NgModule({
  declarations: [AddLayoutComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    SafeLayoutModule,
    SafeButtonModule,
    SafeModalModule,
    SafeGraphQLSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [AddLayoutComponent],
})
export class AddLayoutModule {}
