import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSkeletonTableComponent } from './skeleton-table.component';
import { MatTableModule } from '@angular/material/table';
import { SafeAccessModule } from '../../access/access.module';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [SafeSkeletonTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    SafeAccessModule,
    SafeButtonModule,
    MatSortModule,
    MatChipsModule,
    MatPaginatorModule,
    IndicatorsModule,
    LayoutModule,
    ButtonsModule,
    TranslateModule,
    MatCheckboxModule,
  ],
  exports: [SafeSkeletonTableComponent],
})
export class SafeSkeletonTableModule {}
