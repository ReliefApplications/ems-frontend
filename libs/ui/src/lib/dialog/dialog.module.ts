import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { DialogCloseDirective } from './dialog-close.directive';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from '../tooltip/tooltip.module';
import { ButtonModule } from '../button/button.module';
import { AppResizableBoxComponent } from '../app-resizable-box/app-resizable-box.component';

/**
 * UI Dialog Module
 */
@NgModule({
  declarations: [DialogComponent, DialogCloseDirective],
  imports: [
    CommonModule,
    DialogCdkModule,
    TranslateModule,
    ButtonModule,
    TooltipModule,
    AppResizableBoxComponent,
  ],
  exports: [DialogComponent, DialogCloseDirective, TranslateModule],
})
export class DialogModule {}
