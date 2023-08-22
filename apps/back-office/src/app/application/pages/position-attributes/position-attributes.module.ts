import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@oort-front/ui';
import { MenuModule, TableModule, SpinnerModule } from '@oort-front/ui';
import { PositionAttributesRoutingModule } from './position-attributes-routing.module';
import { PositionAttributesComponent } from './position-attributes.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Position attributes page module
 */
@NgModule({
  declarations: [PositionAttributesComponent],
  imports: [
    CommonModule,
    PositionAttributesRoutingModule,
    SpinnerModule,
    MenuModule,
    IconModule,
    TranslateModule,
    TableModule,
  ],
  exports: [PositionAttributesComponent],
})
export class PositionAttributesModule {}
