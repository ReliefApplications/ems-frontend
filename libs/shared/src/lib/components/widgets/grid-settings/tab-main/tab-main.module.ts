import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMainComponent } from './tab-main.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutTableModule } from '../../../grid-layout/layout-table/layout-table.module';
import {
  TooltipModule,
  DividerModule,
  FormWrapperModule,
  SelectMenuModule,
  IconModule,
  ButtonModule,
  SpinnerModule,
} from '@oort-front/ui';
import { AggregationTableModule } from '../../../aggregation/aggregation-table/aggregation-table.module';
import { ResourceSelectComponent } from '../../../controls/public-api';
import {
  EditorModule as TinyMceEditorModule,
  TINYMCE_SCRIPT_SRC,
} from '@tinymce/tinymce-angular';
import { EditorModule } from '../../editor/editor.module';

/**
 * Main Tab of grid widget configuration modal.
 */
@NgModule({
  declarations: [TabMainComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    LayoutTableModule,
    TooltipModule,
    IconModule,
    DividerModule,
    AggregationTableModule,
    SelectMenuModule,
    ResourceSelectComponent,
    ButtonModule,
    SpinnerModule,
    TinyMceEditorModule,
    EditorModule,
  ],
  exports: [TabMainComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class TabMainModule {}
