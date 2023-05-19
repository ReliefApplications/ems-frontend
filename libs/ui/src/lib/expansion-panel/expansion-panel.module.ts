import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpansionPanelComponent } from './expansion-panel.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';

/**
 * UI Expansion Panel module
 */
@NgModule({
  declarations: [ExpansionPanelComponent],
  imports: [CommonModule, CdkAccordionModule],
  exports: [ExpansionPanelComponent, CdkAccordionModule],
})
export class ExpansionPanelModule {}
