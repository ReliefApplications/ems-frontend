import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGeoFieldsComponent } from './geo-fields.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SafeDividerModule } from '../../ui/divider/divider.module';

/** Module for the SafeGeoFieldsComponent */
@NgModule({
  declarations: [SafeGeoFieldsComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    SafeDividerModule,
  ],
  exports: [SafeGeoFieldsComponent],
})
export class SafeGeoFieldsModule {}
