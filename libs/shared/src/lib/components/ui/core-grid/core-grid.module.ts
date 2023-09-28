import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreGridComponent } from './core-grid.component';
import { GridModule } from './grid/grid.module';

/**
 * Core grid component module.
 */
@NgModule({
  declarations: [CoreGridComponent],
  imports: [CommonModule, GridModule],
  exports: [CoreGridComponent],
})
export class CoreGridModule {}
