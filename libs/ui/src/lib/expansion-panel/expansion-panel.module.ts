import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpansionPanelComponent } from './expansion-panel.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DragDropModule } from '@angular/cdk/drag-drop';

/**
 * UI Expansion Panel module
 */
@NgModule({
  declarations: [ExpansionPanelComponent],
  imports: [CommonModule, CdkAccordionModule, DragDropModule],
  exports: [ExpansionPanelComponent, CdkAccordionModule],
})
export class ExpansionPanelModule {}
