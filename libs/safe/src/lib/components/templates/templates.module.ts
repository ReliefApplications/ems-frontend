import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeTemplatesComponent } from './templates.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import {
  MenuModule,
  DividerModule,
  ButtonModule,
  SpinnerModule,
} from '@oort-front/ui';

/** Module for components related to templates */
@NgModule({
  declarations: [SafeTemplatesComponent],
  imports: [
    CommonModule,
    MatTableModule,
    SpinnerModule,
    MenuModule,
    TranslateModule,
    MatIconModule,
    SafeSkeletonTableModule,
    DividerModule,
    ButtonModule,
  ],
  exports: [SafeTemplatesComponent],
})
export class SafeTemplatesModule {}
