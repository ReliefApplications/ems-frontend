import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayerStylingComponent } from './layer-styling.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SafeDividerModule } from '../../ui/divider/divider.module';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SafeLayerStylingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    SafeDividerModule,
    SafeIconModule,
    TranslateModule,
  ],
  exports: [SafeLayerStylingComponent],
})
export class SafeLayerStylingModule {}
