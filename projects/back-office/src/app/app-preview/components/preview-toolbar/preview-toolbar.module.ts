import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewToolbarComponent } from './preview-toolbar.component';
import { MatDividerModule } from '@angular/material/divider';
import { SafeButtonModule } from '@safe/builder';

/**
 * Toolbar displayed on top of application preview.
 */
@NgModule({
  declarations: [PreviewToolbarComponent],
  imports: [
    CommonModule,
    MatDividerModule,
    SafeButtonModule
  ],
  exports: [PreviewToolbarComponent]
})
export class PreviewToolbarModule { }
