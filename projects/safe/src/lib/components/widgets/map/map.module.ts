import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapComponent } from './map.component';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SafeBadgeModule } from '../../ui/badge/badge.module';

@NgModule({
  declarations: [SafeMapComponent],
  imports: [
    CommonModule,
    TranslateModule,
    LayoutModule, 
    SafeBadgeModule
  ],
  exports: [SafeMapComponent],
})
export class SafeMapModule {}
