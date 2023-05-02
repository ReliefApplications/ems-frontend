import { AfterViewInit, Component, ContentChild } from '@angular/core';
import { SidenavDirective } from './sidenav.directive';

/**
 * UI sidenav component
 */
@Component({
  selector: 'ui-sidenav-container',
  templateUrl: './sidenav-container.component.html',
  styleUrls: ['./sidenav-container.component.scss'],
})
export class SidenavContainerComponent implements AfterViewInit {
  @ContentChild(SidenavDirective) uiSidenavDirective!: SidenavDirective;
  public showSidenav = true;

  ngAfterViewInit() {
    this.uiSidenavDirective.openedChange.subscribe((opened: boolean) => {
      this.showSidenav = opened;
    });
  }
}
