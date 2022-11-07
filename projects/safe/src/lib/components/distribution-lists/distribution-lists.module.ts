import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionListsComponent } from './distribution-lists.component';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatTable } from '@angular/material/table';
import { MatMenuItem } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';

/** Module for components related to distribution list */
@NgModule({
  declarations: [DistributionListsComponent],
  imports: [
    CommonModule,
    SafeSkeletonTableModule,
    SafeButtonModule,
    MatTable,
    MatMenuItem,
    MatDialogModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    TranslateModule,
  ],
})
export class DistributionListsModule {}
