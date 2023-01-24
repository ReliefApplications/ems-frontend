import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayerStylingComponent } from './layer-styling.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SafeDividerModule } from '../../ui/divider/divider.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

/** Module for the SafeLayerStylingComponent */
@NgModule({
  declarations: [SafeLayerStylingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    SafeDividerModule,
    TranslateModule,
  ],
  exports: [SafeLayerStylingComponent],
})
export class SafeLayerStylingModule {}
