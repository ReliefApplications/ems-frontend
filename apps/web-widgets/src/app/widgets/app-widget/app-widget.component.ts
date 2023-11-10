import {
  Component,
  ElementRef,
  Injector,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AuthService } from '@oort-front/shared';
import { ShadowRootExtendedHostComponent } from '../../utils/shadow-root-extended-host.component';

/**
 * Main component of Front-office.
 */
@Component({
  selector: 'oort-application-widget',
  templateUrl: './app-widget.component.html',
  styleUrls: ['./app-widget.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AppWidgetComponent
  extends ShadowRootExtendedHostComponent
  implements OnInit
{
  // @Input() id = '';
  @Input() id = '63c9610ec7dee6439fe33604';
  @Input() displaySideNav = true;
  title = 'front-office';

  /**
   * Main component of Front-office.
   *
   * @param authService Shared authentication service
   * @param el class related element reference
   * @param injector angular application injector
   */
  constructor(
    private authService: AuthService,
    el: ElementRef,
    injector: Injector
  ) {
    super(el, injector);
  }

  /**
   * Configuration of the Authentication behavior
   */
  override ngOnInit(): void {
    super.ngOnInit();
    // this.authService.initLoginSequence();
  }
}
