import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpansionPanelComponent } from './expansion-panel.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';


@NgModule({
  declarations: [ExpansionPanelComponent],
  imports: [CommonModule, CdkAccordionModule],
})
export class ExpansionPanelModule {}
