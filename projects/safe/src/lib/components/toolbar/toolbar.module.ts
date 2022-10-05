import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeToolbarComponent } from './toolbar.component';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeDividerModule } from '../ui/divider/divider.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SafeDateModule } from '../../pipes/date/date.module';


@NgModule({
  declarations: [
    SafeToolbarComponent
  ],
  imports: [
    CommonModule,
    SafeButtonModule,
    SafeDividerModule,
    SafeDateModule,
    IndicatorsModule,
    TranslateModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule
  ],
  exports: [SafeToolbarComponent],
})
export class SafeToolbarModule { }
