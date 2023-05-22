import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeTemplatesComponent } from './templates.component';
import { SpinnerModule, MenuModule } from '@oort-front/ui';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { SafeDividerModule } from '../ui/divider/divider.module';
import { IconModule } from '@oort-front/ui';

/** Module for components related to templates */
@NgModule({
  declarations: [SafeTemplatesComponent],
  imports: [
    CommonModule,
    MatTableModule,
    SpinnerModule,
    MenuModule,
    TranslateModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
    SafeDividerModule,
    IconModule,
  ],
  exports: [SafeTemplatesComponent],
})
export class SafeTemplatesModule {}
