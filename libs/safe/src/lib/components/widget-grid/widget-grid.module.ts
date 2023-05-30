import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWidgetGridComponent } from './widget-grid.component';
import { SafeWidgetModule } from '../widget/widget.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeFloatingOptionsComponent } from './floating-options/floating-options.component';
import { SafeTileDataComponent } from './floating-options/menu/tile-data/tile-data.component';
import { SafeExpandedWidgetComponent } from './expanded-widget/expanded-widget.component';
import { SafeWidgetChoiceModule } from '../widget-choice/widget-choice.module';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { DialogModule, IconModule, SelectMenuModule } from '@oort-front/ui';
import { MenuModule, DividerModule, ButtonModule } from '@oort-front/ui';

/** Module for the widget-related components */
@NgModule({
  declarations: [
    SafeWidgetGridComponent,
    SafeFloatingOptionsComponent,
    SafeTileDataComponent,
    SafeExpandedWidgetComponent,
  ],
  imports: [
    CommonModule,
    SafeWidgetModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MenuModule,
    DividerModule,
    TranslateModule,
    SafeWidgetChoiceModule,
    LayoutModule,
    IndicatorsModule,
    DialogModule,
    ButtonModule,
    IconModule,
    SelectMenuModule,
  ],
  exports: [SafeWidgetGridComponent, SafeTileDataComponent],
})
export class SafeWidgetGridModule {}
