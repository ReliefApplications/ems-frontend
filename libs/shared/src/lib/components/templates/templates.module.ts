import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates.component';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  MenuModule,
  DividerModule,
  ButtonModule,
  TableModule,
  SpinnerModule,
} from '@oort-front/ui';
import { EmptyModule } from '../ui/empty/empty.module';
import { SkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';

/** Module for components related to templates */
@NgModule({
  declarations: [TemplatesComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    MenuModule,
    TranslateModule,
    IconModule,
    SkeletonTableModule,
    DividerModule,
    ButtonModule,
    EmptyModule,
    TableModule,
  ],
  exports: [TemplatesComponent],
})
export class TemplatesModule {}
