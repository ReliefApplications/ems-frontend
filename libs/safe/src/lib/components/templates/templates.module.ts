import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeTemplatesComponent } from './templates.component';
import { MatIconModule } from '@angular/material/icon';
import { MenuModule, SpinnerModule, TableModule } from '@oort-front/ui';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { DividerModule } from '@oort-front/ui';

/** Module for components related to templates */
@NgModule({
  declarations: [SafeTemplatesComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    MenuModule,
    TranslateModule,
    MatIconModule,
    SafeButtonModule,
    SafeSkeletonTableModule,
    DividerModule,
    TableModule,
  ],
  exports: [SafeTemplatesComponent],
})
export class SafeTemplatesModule {}
