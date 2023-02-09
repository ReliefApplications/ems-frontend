import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGeoFieldsComponent } from './geo-fields.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeDividerModule } from '../../ui/divider/divider.module';

/** Module for the SafeGeoFieldsComponent */
@NgModule({
  declarations: [SafeGeoFieldsComponent],
  imports: [CommonModule, MatInputModule, TranslateModule, SafeDividerModule],
  exports: [SafeGeoFieldsComponent],
})
export class SafeGeoFieldsModule {}
