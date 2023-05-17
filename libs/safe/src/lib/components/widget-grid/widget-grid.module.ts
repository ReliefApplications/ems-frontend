import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWidgetGridComponent } from './widget-grid.component';
import { SafeWidgetModule } from '../widget/widget.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SafeFloatingOptionsComponent } from './floating-options/floating-options.component';
import { SafeTileDataComponent } from './floating-options/menu/tile-data/tile-data.component';
import { SafeExpandedWidgetComponent } from './expanded-widget/expanded-widget.component';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeWidgetChoiceModule } from '../widget-choice/widget-choice.module';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SafeIconModule } from '../ui/icon/icon.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SafeModalModule } from '../ui/modal/modal.module';
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
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatDialogModule,
    MenuModule,
    DividerModule,
    SafeButtonModule,
    TranslateModule,
    SafeIconModule,
    SafeWidgetChoiceModule,
    LayoutModule,
    IndicatorsModule,
    SafeModalModule,
    ButtonModule,
  ],
  exports: [SafeWidgetGridComponent, SafeTileDataComponent],
})
export class SafeWidgetGridModule {}
