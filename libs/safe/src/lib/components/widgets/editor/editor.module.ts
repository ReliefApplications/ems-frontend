import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditorComponent } from './editor.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIsolatedHtmlModule } from '../isolated-html/isolated-html.module';

/**
 * Module for the safeEditor component
 */
@NgModule({
  declarations: [SafeEditorComponent],
  imports: [
    CommonModule,
    LayoutModule,
    ButtonModule,
    TranslateModule,
    SafeIsolatedHtmlModule,
  ],
  exports: [SafeEditorComponent],
})
export class SafeEditorModule {}
