import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoGridSettingsComponent } from './grid-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WhoQueryBuilderModule } from '../../query-builder/query-builder.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FloatingButtonSettingsComponent } from './floating-button-settings/floating-button-settings.component';

@NgModule({
  declarations: [WhoGridSettingsComponent, FloatingButtonSettingsComponent],
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
    WhoQueryBuilderModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  exports: [WhoGridSettingsComponent]
})
export class WhoGridSettingsModule { }
