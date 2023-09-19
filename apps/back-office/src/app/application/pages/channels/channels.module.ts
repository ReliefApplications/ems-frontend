import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsRoutingModule } from './channels-routing.module';
import { ChannelsComponent } from './channels.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SpinnerModule,
  MenuModule,
  DividerModule,
  ButtonModule,
  TableModule,
} from '@oort-front/ui';
import { EmptyModule, SkeletonTableModule } from '@oort-front/shared';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Channels page module.
 */
@NgModule({
  declarations: [ChannelsComponent],
  imports: [
    CommonModule,
    ChannelsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    SpinnerModule,
    MenuModule,
    DividerModule,
    TranslateModule,
    ButtonModule,
    TableModule,
    EmptyModule,
    SkeletonTableModule,
  ],
})
export class ChannelsModule {}
