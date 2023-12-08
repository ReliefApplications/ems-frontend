import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetGridComponent } from './widget-grid.component';
import { WidgetModule } from '../widget/widget.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetActionsComponent } from './widget-actions/widget-actions.component';
import { WidgetChoiceModule } from '../widget-choice/widget-choice.module';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { DialogModule, IconModule, SelectMenuModule } from '@oort-front/ui';
import {
  MenuModule,
  DividerModule,
  ButtonModule,
  TooltipModule,
} from '@oort-front/ui';
import { GridsterComponent, GridsterItemComponent } from 'angular-gridster2';

/** Module for the widget-related components */
@NgModule({
  declarations: [WidgetGridComponent, WidgetActionsComponent],
  imports: [
    CommonModule,
    WidgetModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    DividerModule,
    TranslateModule,
    WidgetChoiceModule,
    LayoutModule,
    IndicatorsModule,
    DialogModule,
    ButtonModule,
    IconModule,
    SelectMenuModule,
    TooltipModule,
    GridsterComponent,
    GridsterItemComponent,
  ],
  exports: [WidgetGridComponent],
})
export class WidgetGridModule {}
