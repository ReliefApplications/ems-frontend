import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeQueryBuilderComponent } from './query-builder.component';
import { TabsModule } from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeTabFieldsComponent } from './tab-fields/tab-fields.component';
import { SafeTabSortComponent } from './tab-sort/tab-sort.component';
import { SafeTabFilterComponent } from './tab-filter/tab-filter.component';
import { SafeTabStyleComponent } from './tab-style/tab-style.component';
import { SafeTabLayoutPreviewComponent } from './tab-layout-preview/tab-layout-preview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TooltipModule, TableModule } from '@oort-front/ui';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SafeQueryStyleListComponent } from './tab-style/query-style-list/query-style-list.component';
import { MenuModule } from '@oort-front/ui';
import { SafeQueryStyleComponent } from './tab-style/query-style/query-style.component';
import { SafeQueryStylePreviewComponent } from './tab-style/query-style-preview/query-style-preview.component';
import { SafeCheckboxTreeModule } from '../checkbox-tree/checkbox-tree.module';
import { SafeCoreGridModule } from '../ui/core-grid/core-grid.module';
import { SafeIconModule } from '../ui/icon/icon.module';
import { SliderModule } from '@oort-front/ui';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SafeTabPaginationComponent } from './tab-pagination/tab-pagination.component';
import { SafeFilterModule } from '../filter/filter.module';
import { DateFilterEditorComponent } from './date-filter-editor/date-filter-editor.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SafeAlertModule } from '../ui/alert/alert.module';
import { RadioModule } from '@oort-front/ui';

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
    MatFormFieldModule,
    MatInputModule,
    TabsModule,
    MenuModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    TooltipModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    SafeButtonModule,
    SafeIconModule,
    TranslateModule,
    InputsModule,
    LabelModule,
    SafeCheckboxTreeModule,
    SafeCoreGridModule,
    SliderModule,
    MatDatepickerModule,
    SafeFilterModule,
    EditorModule,
    SafeAlertModule,
    RadioModule,
    TableModule,
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
