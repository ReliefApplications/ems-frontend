import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagerModule } from '@progress/kendo-angular-pager';
import { PaginatorComponent } from './paginator.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * UI Paginator Module
 */
@NgModule({
  declarations: [PaginatorComponent],
  imports: [CommonModule, PagerModule, TranslateModule],
  exports: [PaginatorComponent],
})
export class PaginatorModule {}
