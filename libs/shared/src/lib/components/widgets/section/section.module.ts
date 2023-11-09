import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionComponent } from './section.component';
import { ButtonModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { PortalModule } from '@angular/cdk/portal';

/**
 * Section widget module.
 */
@NgModule({
  declarations: [SectionComponent],
  imports: [CommonModule, TranslateModule, ButtonModule, PortalModule],
  exports: [SectionComponent],
})
export class SectionModule {}
