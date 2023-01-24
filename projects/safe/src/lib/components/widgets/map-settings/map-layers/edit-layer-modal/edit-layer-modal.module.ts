import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeModalModule } from '../../../../ui/modal/modal.module';
import { SafeEditLayerModalComponent } from './edit-layer-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

/** Module for the SafeEditLayerModalComponent */
@NgModule({
  declarations: [SafeEditLayerModalComponent],
  imports: [
    CommonModule,
    SafeModalModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    TranslateModule,
    MatInputModule,
    MatCheckboxModule,
    MatSliderModule,
    NgxSliderModule,
  ],
  exports: [SafeEditLayerModalComponent],
})
export class SafeEditLayerModalModule {}
