import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SkeletonTableModule,
  DateModule as SharedDateModule,
} from '@oort-front/shared';
import { FilterComponent } from './filter/filter.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  MenuModule,
  ButtonModule,
  SpinnerModule,
  TableModule,
  FormWrapperModule,
  IconModule,
  PaginatorModule,
  DateModule,
  TooltipModule,
} from '@oort-front/ui';

/**
 * Resources page module.
 */
@NgModule({
  declarations: [ResourcesComponent, FilterComponent],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    SpinnerModule,
    IconModule,
    MenuModule,
    FormsModule,
    PaginatorModule,
    ReactiveFormsModule,
    TranslateModule,
    SkeletonTableModule,
    SharedDateModule,
    ButtonModule,
    FormWrapperModule,
    TableModule,
    DateModule,
    TooltipModule,
  ],
  exports: [ResourcesComponent],
})
export class ResourcesModule {}
