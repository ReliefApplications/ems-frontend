import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditorComponent } from './editor.component';
import { LayoutModule } from '@progress/kendo-angular-layout';

@NgModule({
  declarations: [SafeEditorComponent],
  imports: [CommonModule, LayoutModule],
  exports: [SafeEditorComponent],
})
export class SafeEditorModule {}
