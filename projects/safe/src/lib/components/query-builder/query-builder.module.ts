import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeQueryBuilderComponent } from './query-builder.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeTabFieldsComponent } from './tab-fields/tab-fields.component';
import { SafeTabSortComponent } from './tab-sort/tab-sort.component';
import { SafeTabFilterComponent } from './tab-filter/tab-filter.component';
import { SafeTabStyleComponent } from './tab-style/tab-style.component';
import { SafeTabLayoutPreviewComponent } from './tab-layout-preview/tab-layout-preview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeTabClorophletComponent } from './tab-clorophlet/tab-clorophlet.component';
import { TranslateModule } from '@ngx-translate/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SafeQueryStyleListComponent } from './tab-style/query-style-list/query-style-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { SafeQueryStyleComponent } from './tab-style/query-style/query-style.component';
import { SafeQueryStylePreviewComponent } from './tab-style/query-style-preview/query-style-preview.component';
import { SafeCheckboxTreeModule } from '../checkbox-tree/checkbox-tree.module';
import { SafeCoreGridModule } from '../ui/core-grid/core-grid.module';
import { SafeIconModule } from '../ui/icon/icon.module';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
    SafeTabClorophletComponent,
    SafeTabStyleComponent,
    SafeTabLayoutPreviewComponent,
    SafeQueryStyleListComponent,
    SafeQueryStyleComponent,
    SafeQueryStylePreviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatTabsModule,
    MatMenuModule,
    MatTableModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    SafeButtonModule,
    SafeIconModule,
    TranslateModule,
    InputsModule,
    LabelModule,
    SafeCheckboxTreeModule,
    SafeCoreGridModule,
    MatSliderModule,
    MatDatepickerModule,
  ],
  exports: [
    SafeQueryBuilderComponent,
    SafeTabFieldsComponent,
    SafeTabFilterComponent,
    SafeTabSortComponent,
  ],
})
export class SafeQueryBuilderModule {}
