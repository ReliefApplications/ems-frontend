import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeQueryBuilderComponent } from './query-builder.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeTabFieldsComponent } from './tab-fields/tab-fields.component';
import { SafeTabSortComponent } from './tab-sort/tab-sort.component';
import { SafeTabFilterComponent } from './tab-filter/tab-filter.component';
import { SafeTabStyleComponent } from './tab-style/tab-style.component';
import { SafeTabLayoutPreviewComponent } from './tab-layout-preview/tab-layout-preview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@oort-front/ui';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { SafeQueryStyleListComponent } from './tab-style/query-style-list/query-style-list.component';
import { SafeQueryStyleComponent } from './tab-style/query-style/query-style.component';
import { SafeQueryStylePreviewComponent } from './tab-style/query-style-preview/query-style-preview.component';
import { SafeCheckboxTreeModule } from '../checkbox-tree/checkbox-tree.module';
import { SafeCoreGridModule } from '../ui/core-grid/core-grid.module';
import { SliderModule } from '@oort-front/ui';
import { SafeTabPaginationComponent } from './tab-pagination/tab-pagination.component';
import { SafeFilterModule } from '../filter/filter.module';
import { DateFilterEditorComponent } from './date-filter-editor/date-filter-editor.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import {
  MenuModule,
  TooltipModule,
  RadioModule,
  ButtonModule,
  TableModule,
  FormWrapperModule,
  AlertModule,
  SelectMenuModule,
  AutocompleteModule,
  TabsModule,
  DateModule,
} from '@oort-front/ui';

/**
 * SafeQueryBuilderModule is a class used to manage all the modules and components
 * related to the query builder.
 */
@NgModule({
  declarations: [
    SafeQueryBuilderComponent,
    SafeTabFieldsComponent,
    SafeTabSortComponent,
    SafeTabFilterComponent,
    SafeTabStyleComponent,
    SafeTabLayoutPreviewComponent,
    SafeQueryStyleListComponent,
    SafeQueryStyleComponent,
    SafeQueryStylePreviewComponent,
    SafeTabPaginationComponent,
    DateFilterEditorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    MenuModule,
    DragDropModule,
    IconModule,
    DateModule,
    TooltipModule,
    MatAutocompleteModule,
    TranslateModule,
    InputsModule,
    LabelModule,
    SafeCheckboxTreeModule,
    SafeCoreGridModule,
    SliderModule,
    SafeFilterModule,
    EditorModule,
    RadioModule,
    ButtonModule,
    TableModule,
    AutocompleteModule,
    AlertModule,
    FormWrapperModule,
    SelectMenuModule,
  ],
  exports: [
    SafeQueryBuilderComponent,
    SafeTabFieldsComponent,
    SafeTabFilterComponent,
    SafeTabSortComponent,
    SafeTabPaginationComponent,
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SafeQueryBuilderModule {}
