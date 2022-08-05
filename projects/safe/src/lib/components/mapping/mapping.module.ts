import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMappingComponent } from './mapping.component';
import { SafeMappingModalComponent } from './mapping-modal/mapping-modal.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SafeButtonModule,
  ],
  exports: [SafeMappingComponent, SafeMappingModalComponent],
})
export class SafeMappingModule {}
