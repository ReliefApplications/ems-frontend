import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationDistributionListsComponent } from './application-distribution-lists.component';
import { SafeApplicationDistributionListsRoutingModule } from './application-distribution-lists-routing.module';
import { DistributionListsModule } from '../../components/distribution-lists/distribution-lists.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Page to view distribution lists within app.
 */
@NgModule({
  declarations: [SafeApplicationDistributionListsComponent],
  imports: [
    CommonModule,
    SafeApplicationDistributionListsRoutingModule,
    DistributionListsModule,
    MatProgressSpinnerModule,
  ],
  exports: [SafeApplicationDistributionListsComponent],
})
export class SafeApplicationDistributionListsViewModule {}
