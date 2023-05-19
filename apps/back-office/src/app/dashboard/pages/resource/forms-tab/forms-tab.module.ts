import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsTabRoutingModule } from './forms-tab-routing.module';
import { FormsTabComponent } from './forms-tab.component';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { MenuModule, TableModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeButtonModule,
  SafeDateModule,
  SafeSkeletonTableModule,
} from '@oort-front/safe';

/**
 * Forms tab of resource page.
 */
@NgModule({
  declarations: [FormsTabComponent],
  imports: [
    CommonModule,
    FormsTabRoutingModule,
    MatIconModule,
    MenuModule,
    MatChipsModule,
    SafeButtonModule,
    TranslateModule,
    SafeDateModule,
    SafeSkeletonTableModule,
    TableModule,
  ],
})
export class FormsTabModule {}
