import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPropertiesComponent } from './map-properties.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SliderModule,
  FormWrapperModule,
  SelectMenuModule,
  IconModule,
  ButtonModule,
  DividerModule,
  CheckboxModule,
  AlertModule,
  ToggleModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { MapControlsModule } from './map-controls/map-controls.module';
import { WebmapSelectComponent } from './webmap-select/webmap-select.component';
import { TooltipModule, ErrorMessageModule } from '@oort-front/ui';
import { PortalModule } from '@angular/cdk/portal';
import {
  EditorModule as TinyMceEditorModule,
  TINYMCE_SCRIPT_SRC,
} from '@tinymce/tinymce-angular';
import { EditorModule } from '../../editor/editor.module';

/**
 * Module of Map Properties of Map Widget.
 */
@NgModule({
  declarations: [MapPropertiesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TooltipModule,
    SelectMenuModule,
    IconModule,
    ButtonModule,
    DividerModule,
    CheckboxModule,
    MapControlsModule,
    WebmapSelectComponent,
    FormWrapperModule,
    SliderModule,
    TooltipModule,
    IconModule,
    // MapModule,
    SelectMenuModule,
    ErrorMessageModule,
    PortalModule,
    AlertModule,
    ToggleModule,
    TinyMceEditorModule,
    EditorModule,
  ],
  exports: [MapPropertiesComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class MapPropertiesModule {}
