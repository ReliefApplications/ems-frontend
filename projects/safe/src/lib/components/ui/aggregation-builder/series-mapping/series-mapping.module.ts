import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSeriesMappingComponent } from './series-mapping.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SafeSeriesMappingComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [SafeSeriesMappingComponent],
})
export class SafeSeriesMappingModule {}
