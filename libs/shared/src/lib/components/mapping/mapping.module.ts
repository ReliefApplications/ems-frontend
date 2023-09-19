import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappingComponent } from './mapping.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MenuModule,
  ButtonModule,
  TableModule,
  DialogModule,
  DividerModule,
  IconModule,
} from '@oort-front/ui';

/**
 * Mapping module
 */
@NgModule({
  declarations: [MappingComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    TableModule,
    DividerModule,
  ],
  exports: [MappingComponent],
})
export class MappingModule {}
