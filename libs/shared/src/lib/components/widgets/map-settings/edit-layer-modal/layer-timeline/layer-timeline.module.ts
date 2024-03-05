import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerTimelineComponent } from './layer-timeline.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormWrapperModule,
  SelectMenuModule,
  ToggleModule,
} from '@oort-front/ui';
import { PortalModule } from '@angular/cdk/portal';

/**
 * Map layer properties module.
 */
@NgModule({
  declarations: [LayerTimelineComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ToggleModule,
    FormWrapperModule,
    PortalModule,
    SelectMenuModule,
  ],
  exports: [LayerTimelineComponent],
})
export class LayerTimelineModule {}
