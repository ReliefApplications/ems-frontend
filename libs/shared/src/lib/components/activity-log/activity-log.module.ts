import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityLogComponent } from './activity-log.component';
import { TableModule, IconModule, ButtonModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyModule } from '../ui/empty/empty.module';

/** Module for components related to templates */
@NgModule({
  declarations: [ActivityLogComponent],
  imports: [
    CommonModule,
    TableModule,
    TranslateModule,
    IconModule,
    ButtonModule,
    EmptyModule,
  ],
  exports: [ActivityLogComponent],
})
export class ActivityLogModule {}
