import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerStylingComponent } from './layer-styling.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SafeDividerModule } from '../../ui/divider/divider.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

/** Module for the LayerStylingComponent */
@NgModule({
  declarations: [LayerStylingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    SafeDividerModule,
    TranslateModule,
  ],
  exports: [LayerStylingComponent],
})
export class LayerStylingModule {}
