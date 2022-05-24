import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePageNotFoundComponent } from './page-not-found.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SafePageNotFoundComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [SafePageNotFoundComponent],
})
export class SafePageNotFoundModule {}
