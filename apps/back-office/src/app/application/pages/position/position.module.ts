import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionRoutingModule } from './position-routing.module';
import { PositionComponent } from './position.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmptyModule, SkeletonTableModule } from '@oort-front/shared';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  SpinnerModule,
  MenuModule,
  ButtonModule,
  TableModule,
  DialogModule,
  DividerModule,
} from '@oort-front/ui';

/**
 * Application position module.
 */
@NgModule({
  declarations: [PositionComponent],
  imports: [
    CommonModule,
    PositionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    IconModule,
    MenuModule,
    TranslateModule,
    DialogModule,
    SkeletonTableModule,
    EmptyModule,
    ButtonModule,
    TableModule,
    DividerModule,
  ],
  exports: [PositionComponent],
})
export class PositionModule {}
