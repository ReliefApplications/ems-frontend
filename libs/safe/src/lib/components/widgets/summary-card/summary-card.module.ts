import { LayoutModule } from '@progress/kendo-angular-layout';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSummaryCardComponent } from './summary-card.component';
import { SummaryCardItemModule } from './summary-card-item/summary-card-item.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SafeGridWidgetModule } from '../grid/grid.module';
import {
  TooltipModule,
  ButtonModule,
  PaginatorModule,
  SpinnerModule,
  SelectMenuModule,
  FormWrapperModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeSkeletonModule } from '../../../directives/skeleton/skeleton.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

/** Summary Card Widget Module */
@NgModule({
  declarations: [SafeSummaryCardComponent],
  imports: [
    CommonModule,
    LayoutModule,
    PDFExportModule,
    SummaryCardItemModule,
    SafeGridWidgetModule,
    IndicatorsModule,
    TooltipModule,
    TranslateModule,
    ButtonModule,
    InputsModule,
    FormsModule,
    ReactiveFormsModule,
    SafeSkeletonModule,
    PaginatorModule,
    SpinnerModule,
    DropDownsModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
  exports: [SafeSummaryCardComponent],
})
export class SafeSummaryCardModule {}
