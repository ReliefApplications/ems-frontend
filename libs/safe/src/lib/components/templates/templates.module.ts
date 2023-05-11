import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeTemplatesComponent } from './templates.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { SpinnerModule } from '@oort-front/ui';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { SafeDividerModule } from '../ui/divider/divider.module';

/** Module for components related to templates */
@NgModule({
  declarations: [SafeTemplatesComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatMenuModule,
    SpinnerModule,
    TranslateModule,
    MatIconModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
    SafeDividerModule,
  ],
  exports: [SafeTemplatesComponent],
})
export class SafeTemplatesModule {}
