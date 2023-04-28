import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpansionPanelComponent } from './expansion-panel.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * UI expasionPanel module
 */
@NgModule({
  declarations: [ExpansionPanelComponent],
  imports: [CommonModule, CdkAccordionModule, BrowserAnimationsModule],
})
export class ExpansionPanelModule {}
