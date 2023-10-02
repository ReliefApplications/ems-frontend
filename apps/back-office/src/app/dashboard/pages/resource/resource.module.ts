import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceRoutingModule } from './resource-routing.module';
import { ResourceComponent } from './resource.component';
import {
  SpinnerModule,
  MenuModule,
  TabsModule,
  PaginatorModule,
} from '@oort-front/ui';
import { IconModule } from '@oort-front/ui';
import { AccessModule, DateModule } from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { UploadMenuModule } from '../../../components/upload-menu/upload-menu.module';

/** Resource page module. */
@NgModule({
  declarations: [ResourceComponent],
  imports: [
    CommonModule,
    ResourceRoutingModule,
    SpinnerModule,
    TabsModule,
    IconModule,
    MenuModule,
    AccessModule,
    PaginatorModule,
    TranslateModule,
    OverlayModule,
    UploadMenuModule,
    DateModule,
  ],
  exports: [ResourceComponent],
})
export class ResourceModule {}
