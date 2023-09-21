import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryBuilderComponent } from './query-builder.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TabFieldsComponent } from './tab-fields/tab-fields.component';
import { TabSortComponent } from './tab-sort/tab-sort.component';
import { TabFilterComponent } from './tab-filter/tab-filter.component';
import { TabStyleComponent } from './tab-style/tab-style.component';
import { TabLayoutPreviewComponent } from './tab-layout-preview/tab-layout-preview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { QueryStyleListComponent } from './tab-style/query-style-list/query-style-list.component';
import { QueryStyleComponent } from './tab-style/query-style/query-style.component';
import { QueryStylePreviewComponent } from './tab-style/query-style-preview/query-style-preview.component';
import { CoreGridModule } from '../ui/core-grid/core-grid.module';
import { SliderModule } from '@oort-front/ui';
import { TabPaginationComponent } from './tab-pagination/tab-pagination.component';
import { FilterModule } from '../filter/filter.module';
import { DateFilterEditorComponent } from './date-filter-editor/date-filter-editor.component';
import { EditorControlComponent } from '../editor-control/editor-control.component';
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
  DividerModule,
  IconModule,
} from '@oort-front/ui';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

/**
 * QueryBuilderModule is a class used to manage all the modules and components
 * related to the query builder.
 */
@NgModule({
  declarations: [
    QueryBuilderComponent,
    TabFieldsComponent,
    TabSortComponent,
    TabFilterComponent,
    TabStyleComponent,
    TabLayoutPreviewComponent,
    QueryStyleListComponent,
    QueryStyleComponent,
    QueryStylePreviewComponent,
    TabPaginationComponent,
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
    AutocompleteModule,
    TranslateModule,
    InputsModule,
    LabelModule,
    CoreGridModule,
    SliderModule,
    FilterModule,
    AlertModule,
    EditorControlComponent,
    RadioModule,
    ButtonModule,
    TableModule,
    AutocompleteModule,
    AlertModule,
    FormWrapperModule,
    SelectMenuModule,
    DividerModule,
    TreeViewModule,
  ],
  exports: [
    QueryBuilderComponent,
    TabFieldsComponent,
    TabFilterComponent,
    TabSortComponent,
    TabPaginationComponent,
  ],
})
export class QueryBuilderModule {}
