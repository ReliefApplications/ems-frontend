import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsArchiveComponent } from './applications-archive.component';
import {
  TableModule,
  SelectMenuModule,
  FormWrapperModule,
  IconModule,
  DividerModule,
} from '@oort-front/ui';
import { SafeEmptyModule } from '../ui/empty/empty.module';
import { SafeDateModule } from '../../pipes/date/date.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule, MenuModule } from '@oort-front/ui';

/**
 * Safe Applications Archive module
 */
@NgModule({
  declarations: [ApplicationsArchiveComponent],
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    FormsModule,
    SelectMenuModule,
    TableModule,
    SafeEmptyModule,
    FormWrapperModule,
    IconModule,
    SafeDateModule,
    TranslateModule,
    DividerModule,
  ],
  exports: [ApplicationsArchiveComponent],
})
export class SafeApplicationsArchiveModule {}
