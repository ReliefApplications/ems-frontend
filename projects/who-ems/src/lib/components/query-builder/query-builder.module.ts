import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoQueryBuilderComponent } from './query-builder.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WhoTabFieldsComponent } from './tab-fields/tab-fields.component';
import { WhoTabSortComponent } from './tab-sort/tab-sort.component';
import { WhoTabFilterComponent } from './tab-filter/tab-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    WhoQueryBuilderComponent,
    WhoTabFieldsComponent,
    WhoTabSortComponent,
    WhoTabFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  exports: [WhoQueryBuilderComponent]
})
export class WhoQueryBuilderModule { }
