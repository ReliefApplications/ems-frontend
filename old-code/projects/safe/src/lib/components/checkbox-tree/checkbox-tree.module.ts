import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeCheckboxTreeComponent } from './checkbox-tree.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';

/**
 * SafeCheckboxTreeModule is a class used to manage all the modules and components
 * related to the checkbox trees.
 */
@NgModule({
  declarations: [SafeCheckboxTreeComponent],
  imports: [
    CommonModule,
    CdkTreeModule,
    MatTreeModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  exports: [SafeCheckboxTreeComponent],
})
export class SafeCheckboxTreeModule {}
