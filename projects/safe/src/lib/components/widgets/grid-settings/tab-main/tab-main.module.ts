import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMainComponent } from './tab-main.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { LayoutsModule } from '../../../grid-layout/layouts/layouts.module';

@NgModule({
  declarations: [TabMainComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    LayoutsModule,
  ],
  exports: [TabMainComponent],
})
export class TabMainModule {}
