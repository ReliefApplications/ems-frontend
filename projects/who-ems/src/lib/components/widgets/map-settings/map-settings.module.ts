import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoMapSettingsComponent } from './map-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WhoQueryBuilderModule } from '../../query-builder/query-builder.module';

@NgModule({
  declarations: [WhoMapSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TextFieldModule,
    WhoQueryBuilderModule
  ],
  exports: [WhoMapSettingsComponent]
})
export class WhoMapSettingsModule { }
