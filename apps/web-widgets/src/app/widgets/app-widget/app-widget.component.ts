import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ShadowRootExtendedHostComponent } from '../../utils/shadow-root-extended-host.component';
import { ContextService } from '@oort-front/shared';
import { debounceTime } from 'rxjs';
import { isEmpty } from 'lodash';

/**
 * Application as Web Widget.
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
  /** Application Id */
  @Input() id = '63c9610ec7dee6439fe33604';

  /**
   * Set dashboard filter visibility status
   */
  @Input()
  set toggleFilter(opened: boolean) {
    this.onToggleFilter(opened);
  }

  @Output()
  filterActive$ = new EventEmitter<boolean>();

  /**
   * Application as Web Widget.
   *
   * @param el class related element reference
   * @param injector angular application injector
   * @param contextService Shared context service
   */
  constructor(
    el: ElementRef,
    injector: Injector,
    private contextService: ContextService
  ) {
    super(el, injector);
    this.contextService.filter$.pipe(debounceTime(500)).subscribe((value) => {
      this.filterActive$.emit(!isEmpty(value));
    });
  }

  /**
   * Toggle filter visibility.
   *
   * @param opened visibility status.
   */
  private onToggleFilter(opened: boolean) {
    this.contextService.filterOpened.next(opened);
  }

  /**
   * Configuration of the Authentication behavior
   */
  override ngOnInit(): void {
    super.ngOnInit();
    console.log(this.contextService);
  }
}
