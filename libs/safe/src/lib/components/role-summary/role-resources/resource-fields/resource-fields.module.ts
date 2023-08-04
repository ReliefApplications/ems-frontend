import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  CheckboxModule,
  ButtonModule,
  TooltipModule,
  TableModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourceFieldsComponent } from './resource-fields.component';

/**
 * Resource fields array of Role resources component.
 */
@NgModule({
  declarations: [ResourceFieldsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    CheckboxModule,
    ButtonModule,
    TooltipModule,
    TableModule,
    SelectMenuModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ResourceFieldsComponent],
})
export class ResourceFieldsModule {}
