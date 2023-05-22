import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeApplicationDistributionListsComponent } from './application-distribution-lists.component';
import { SafeApplicationDistributionListsRoutingModule } from './application-distribution-lists-routing.module';
import { DistributionListsModule } from '../../components/distribution-lists/distribution-lists.module';
import { SpinnerModule } from '@oort-front/ui';

/**
 * Page to view distribution lists within app.
 */
@NgModule({
  declarations: [SafeApplicationDistributionListsComponent],
  imports: [
    CommonModule,
    SafeApplicationDistributionListsRoutingModule,
    DistributionListsModule,
    SpinnerModule,
  ],
  exports: [SafeApplicationDistributionListsComponent],
})
export class SafeApplicationDistributionListsViewModule {}
