import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationTabComponent } from './navigation-tab.component';
import { NavigationTabDirective } from './navigation-tab.directive';

@NgModule({
  declarations: [NavigationTabComponent, NavigationTabDirective],
  imports: [CommonModule],
  exports: [NavigationTabComponent, NavigationTabDirective],
})
export class NavigationTabModule {}
