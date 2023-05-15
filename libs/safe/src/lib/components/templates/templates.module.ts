import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeTemplatesComponent } from './templates.component';
import { MatIconModule } from '@angular/material/icon';
import { MenuModule } from '@oort-front/ui';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
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
    MenuModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatIconModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
    SafeDividerModule,
  ],
  exports: [SafeTemplatesComponent],
})
export class SafeTemplatesModule {}
