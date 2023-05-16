import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeCheckboxTreeComponent } from './checkbox-tree.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { CheckboxModule } from '@oort-front/ui';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from '@oort-front/ui';

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
    CheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ButtonModule,
  ],
  exports: [SafeCheckboxTreeComponent],
})
export class SafeCheckboxTreeModule {}
