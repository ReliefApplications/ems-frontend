import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMarkerRuleComponent } from './map-marker-rule.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { SafeQueryBuilderModule } from '../../../../query-builder/query-builder.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeAlertModule } from '../../../../ui/alert/alert.module';
import { SafeIconModule } from '../../../../ui/icon/icon.module';

/**
 * Single Marker Rule configuration module.
 */
@NgModule({
  declarations: [MapMarkerRuleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SafeQueryBuilderModule,
    MatTooltipModule,
    SafeIconModule,
  ],
  exports: [MapMarkerRuleComponent],
})
export class MapMarkerRuleModule {}
