import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayerPopupComponent } from './layer-popup.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/** Module for the Layer popup Component */
@NgModule({
  declarations: [SafeLayerPopupComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  exports: [SafeLayerPopupComponent],
})
export class SafeLayerPopupModule {}
