import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMappingComponent } from './mapping.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SafeModalModule } from '../ui/modal/modal.module';
import { IconModule } from '@oort-front/ui';

/**
 * Mapping module
 */
@NgModule({
  declarations: [SafeMappingComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SafeButtonModule,
    SafeModalModule,
    IconModule,
  ],
  exports: [SafeMappingComponent],
})
export class SafeMappingModule {}
