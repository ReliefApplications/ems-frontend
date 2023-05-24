import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { SafeAddCardComponent } from './add-card.component';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { MatRippleModule } from '@angular/material/core';
import { SafeCardTemplateComponent } from './card-template/card-template.component';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { SafeSkeletonModule } from '../../../../directives/skeleton/skeleton.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SafeAlertModule } from '../../../ui/alert/alert.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SpinnerModule, FormWrapperModule, IconModule } from '@oort-front/ui';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule, RadioModule, ButtonModule } from '@oort-front/ui';

/** Module to add new card in summary card widget */
@NgModule({
  declarations: [SafeAddCardComponent, SafeCardTemplateComponent],
  imports: [
    CommonModule,
    TooltipModule,
    TranslateModule,
    MatDividerModule,
    SafeModalModule,
    MatRippleModule,
    SafeIconModule,
    SafeSkeletonModule,
    IndicatorsModule,
    SafeAlertModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SpinnerModule,
    MatIconModule,
    FormWrapperModule,
    IconModule,
    RadioModule,
    ButtonModule,
  ],
  exports: [SafeAddCardComponent, SafeCardTemplateComponent],
})
export class SafeAddCardModule {}
