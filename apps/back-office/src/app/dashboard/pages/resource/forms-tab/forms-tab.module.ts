import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsTabRoutingModule } from './forms-tab-routing.module';
import { FormsTabComponent } from './forms-tab.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule, SafeSkeletonTableModule } from '@oort-front/safe';
import { MenuModule, ButtonModule, ChipModule } from '@oort-front/ui';

/**
 * Forms tab of resource page.
 */
@NgModule({
  declarations: [FormsTabComponent],
  imports: [
    CommonModule,
    FormsTabRoutingModule,
    MatTableModule,
    MatIconModule,
    MenuModule,
    TranslateModule,
    SafeDateModule,
    SafeSkeletonTableModule,
    ChipModule,
    ButtonModule,
  ],
})
export class FormsTabModule {}
