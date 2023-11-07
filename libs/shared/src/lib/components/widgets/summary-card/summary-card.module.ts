import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCardComponent } from './summary-card.component';
import { SummaryCardItemModule } from './summary-card-item/summary-card-item.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { GridWidgetModule } from '../grid/grid.module';
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
import { SkeletonModule } from '../../../directives/skeleton/skeleton.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

/** Summary Card Widget Module */
@NgModule({
  declarations: [SummaryCardComponent],
  imports: [
    CommonModule,
    PDFExportModule,
    SummaryCardItemModule,
    GridWidgetModule,
    IndicatorsModule,
    TooltipModule,
    TranslateModule,
    ButtonModule,
    InputsModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonModule,
    PaginatorModule,
    SpinnerModule,
    DropDownsModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
  exports: [SummaryCardComponent],
})
export class SummaryCardModule {}
