import { NgModule } from '@angular/core';
import { SafeShareRedirectComponent } from './share-redirect.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [SafeShareRedirectComponent],
  imports: [MatProgressSpinnerModule],
  exports: [SafeShareRedirectComponent],
})
export class SafeShareRedirectModule {}
