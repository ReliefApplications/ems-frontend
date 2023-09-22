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
import { EmptyModule } from '../ui/empty/empty.module';
import { DateModule } from '../../pipes/date/date.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule, MenuModule } from '@oort-front/ui';

/**
 * Shared Applications Archive module
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
    EmptyModule,
    FormWrapperModule,
    IconModule,
    DateModule,
    TranslateModule,
    DividerModule,
  ],
  exports: [ApplicationsArchiveComponent],
})
export class ApplicationsArchiveModule {}
