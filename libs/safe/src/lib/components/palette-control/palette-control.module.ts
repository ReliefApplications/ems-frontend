import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePaletteControlComponent } from './palette-control.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

/**
 * Palette form control module.
 */
@NgModule({
  declarations: [SafePaletteControlComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    DragDropModule,
  ],
  exports: [SafePaletteControlComponent],
})
export class SafePaletteControlModule {}
