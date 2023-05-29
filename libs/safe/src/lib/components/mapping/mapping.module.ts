import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMappingComponent } from './mapping.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import {
  MenuModule,
  ButtonModule,
  TableModule,
  DialogModule,
} from '@oort-front/ui';

/**
 * Mapping module
 */
@NgModule({
  declarations: [SafeMappingComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    TableModule,
  ],
  exports: [SafeMappingComponent],
})
export class SafeMappingModule {}
