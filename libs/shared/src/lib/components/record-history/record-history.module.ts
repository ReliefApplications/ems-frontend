import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordHistoryComponent } from './record-history.component';
import {
  ExpansionPanelModule,
  MenuModule,
  ButtonModule,
  SelectMenuModule,
  DateModule as UiDateModule,
  FormWrapperModule,
  TooltipModule,
  TableModule,
  ToggleModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DateModule } from '../../pipes/date/date.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { EmptyModule } from '../ui/empty/empty.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ResizableModule } from 'angular-resizable-element';

/**
 * RecordHistoryModule is a class used to manage all the modules and components
 * related to the history of records.
 */
@NgModule({
  declarations: [RecordHistoryComponent],
  imports: [
    CommonModule,
    ExpansionPanelModule,
    MenuModule,
    TranslateModule,
    UiDateModule,
    IndicatorsModule,
    EmptyModule,
    ButtonModule,
    DateModule,
    SelectMenuModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TooltipModule,
    FormsModule,
    TableModule,
    ToggleModule,
    ResizableModule,
  ],
  exports: [RecordHistoryComponent],
})
export class RecordHistoryModule {}
