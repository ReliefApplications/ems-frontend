import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerPopupComponent } from './layer-popup.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

/**
 * Map layer properties popup module.
 */
@NgModule({
  declarations: [LayerPopupComponent],
  imports: [
    CommonModule,
    DragDropModule,
    SafeButtonModule,
    TranslateModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatMenuModule,
  ],
  exports: [LayerPopupComponent],
})
export class LayerPopupModule {}
