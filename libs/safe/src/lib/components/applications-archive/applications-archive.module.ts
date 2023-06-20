import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsArchiveComponent } from './applications-archive.component';
import { SafeSkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import {
  TableModule,
  SelectMenuModule,
  FormWrapperModule,
  IconModule,
} from '@oort-front/ui';
import { SafeEmptyModule } from '../ui/empty/empty.module';
import { SafeDateModule } from '../../pipes/date/date.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

/**
 * Safe Applications Archive module
 */
@NgModule({
  declarations: [ApplicationsArchiveComponent],
  imports: [
    CommonModule,
    FormsModule,
    SafeSkeletonTableModule,
    SelectMenuModule,
    TableModule,
    SafeEmptyModule,
    FormWrapperModule,
    IconModule,
    SafeDateModule,
    TranslateModule,
  ],
  exports: [ApplicationsArchiveComponent],
})
export class SafeApplicationsArchiveModule {}
