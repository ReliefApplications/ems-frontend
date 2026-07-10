import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { ButtonModule, SpinnerModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { HtmlWidgetContentModule } from '../common/html-widget-content/html-widget-content.module';
import { LocalizePipe } from '../../../pipes/localize/localize.pipe';

/**
 * Module for the sharedEditor component
 */
@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    ButtonModule,
    TranslateModule,
    HtmlWidgetContentModule,
    SpinnerModule,
    LocalizePipe,
  ],
  exports: [EditorComponent],
})
export class EditorModule {}
