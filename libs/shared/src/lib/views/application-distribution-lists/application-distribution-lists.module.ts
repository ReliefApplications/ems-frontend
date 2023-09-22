import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationDistributionListsComponent } from './application-distribution-lists.component';
import { ApplicationDistributionListsRoutingModule } from './application-distribution-lists-routing.module';
import { DistributionListsModule } from '../../components/distribution-lists/distribution-lists.module';
import { SpinnerModule } from '@oort-front/ui';

/**
 * Page to view distribution lists within app.
 */
@NgModule({
  declarations: [ApplicationDistributionListsComponent],
  imports: [
    CommonModule,
    ApplicationDistributionListsRoutingModule,
    DistributionListsModule,
    SpinnerModule,
  ],
  exports: [ApplicationDistributionListsComponent],
})
export class ApplicationDistributionListsViewModule {}
