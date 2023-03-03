import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMappingComponent } from './mapping.component';
import { SafeMappingModalComponent } from './mapping-modal/mapping-modal.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SafeModalModule } from '../ui/modal/modal.module';

/**
 * Mapping module
 */
@NgModule({
  declarations: [SafeMappingComponent, SafeMappingModalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SafeButtonModule,
    SafeModalModule,
  ],
  exports: [SafeMappingComponent, SafeMappingModalComponent],
})
export class SafeMappingModule {}
