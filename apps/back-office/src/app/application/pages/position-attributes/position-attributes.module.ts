import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MenuModule, UiModule, SpinnerModule } from '@oort-front/ui';
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
    MatButtonModule,
    MenuModule,
    MatIconModule,
    TranslateModule,
    UiModule,
  ],
  exports: [PositionAttributesComponent],
})
export class PositionAttributesModule {}
