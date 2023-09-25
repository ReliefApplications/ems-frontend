import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetGridComponent } from './widget-grid.component';
import { WidgetModule } from '../widget/widget.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloatingOptionsComponent } from './floating-options/floating-options.component';
import { TileDataComponent } from './floating-options/menu/tile-data/tile-data.component';
import { ExpandedWidgetComponent } from './expanded-widget/expanded-widget.component';
import { WidgetChoiceModule } from '../widget-choice/widget-choice.module';
import { TranslateModule } from '@ngx-translate/core';
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
  declarations: [
    WidgetGridComponent,
    FloatingOptionsComponent,
    TileDataComponent,
    ExpandedWidgetComponent,
  ],
  imports: [
    CommonModule,
    WidgetModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    DividerModule,
    TranslateModule,
    WidgetChoiceModule,
    IndicatorsModule,
    DialogModule,
    ButtonModule,
    IconModule,
    SelectMenuModule,
    TooltipModule,
    GridsterComponent,
    GridsterItemComponent,
  ],
  exports: [WidgetGridComponent, TileDataComponent],
})
export class WidgetGridModule {}
