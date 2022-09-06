import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { SafeAddCardComponent } from './add-card.component';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { MatRippleModule } from '@angular/material/core';
import { SafeCardTemplateComponent } from './card-template/card-template.component';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { SafeSkeletonModule } from '../../../../directives/skeleton/skeleton.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

/** Module to add new card in summary card widget */
@NgModule({
  declarations: [SafeAddCardComponent, SafeCardTemplateComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatInputModule,
    TranslateModule,
    MatRadioModule,
    MatDividerModule,
    SafeModalModule,
    MatRippleModule,
    SafeIconModule,
    SafeSkeletonModule,
    BrowserModule,
    BrowserAnimationsModule,
    IndicatorsModule,
    LayoutModule,
    ButtonsModule,
  ],
  exports: [SafeAddCardComponent, SafeCardTemplateComponent],
})
export class SafeAddCardModule {}
