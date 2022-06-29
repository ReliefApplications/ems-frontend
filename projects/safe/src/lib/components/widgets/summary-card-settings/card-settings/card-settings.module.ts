import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeCardSettingsComponent } from './card-settings.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';

/** Card Settings Module */
@NgModule({
  declarations: [SafeCardSettingsComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    TranslateModule,
    MatTooltipModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatRadioModule,
  ],
  exports: [SafeCardSettingsComponent],
})
export class SafeCardSettingsModule {}
