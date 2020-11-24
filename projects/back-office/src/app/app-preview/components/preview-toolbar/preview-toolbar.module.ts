import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewToolbarComponent } from './preview-toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [PreviewToolbarComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule
  ],
  exports: [PreviewToolbarComponent]
})
export class PreviewToolbarModule { }
