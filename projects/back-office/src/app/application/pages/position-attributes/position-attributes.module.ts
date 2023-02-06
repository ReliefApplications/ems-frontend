import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
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
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule,
  ],
  exports: [PositionAttributesComponent],
})
export class PositionAttributesModule {}
