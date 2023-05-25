import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeTemplatesComponent } from './templates.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  MenuModule,
  DividerModule,
  ButtonModule,
  TableModule,
  SpinnerModule,
} from '@oort-front/ui';
import { SafeEmptyModule } from '../ui/empty/empty.module';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';

/** Module for components related to templates */
@NgModule({
  declarations: [SafeTemplatesComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    MenuModule,
    TranslateModule,
    MatIconModule,
    SafeSkeletonTableModule,
    DividerModule,
    ButtonModule,
    SafeEmptyModule,
    TableModule,
  ],
  exports: [SafeTemplatesComponent],
})
export class SafeTemplatesModule {}
