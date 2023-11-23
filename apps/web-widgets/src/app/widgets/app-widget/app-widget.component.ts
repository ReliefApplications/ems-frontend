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
import {
  Application,
  ApplicationService,
  ContentType,
  ContextService,
} from '@oort-front/shared';
import { debounceTime } from 'rxjs';
import { isEmpty } from 'lodash';
import { Router } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { ShadowDomService } from '@oort-front/ui';

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
  @Input()
  set id(value: string) {
    // Get the current path
    const currentPath = this.location.path();
    if (currentPath.includes(value)) {
      // Path includes the id
      this.router.navigateByUrl(`${currentPath}`);
    } else {
      // Else, navigate to homepage of the app
      this.router.navigate([`./${value}`]);
    }
  }

  /**
   * Set dashboard filter visibility status
   */
  @Input()
  set toggleFilter(opened: boolean) {
    this.onToggleFilter(opened);
  }

  @Input()
  set path(value: string) {
    this.router.navigate([value]);
  }

  @Output()
  filterActive$ = new EventEmitter<boolean>();
  @Output()
  pages = new EventEmitter<any[]>();

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
    private contextService: ContextService,
    private router: Router,
    private applicationService: ApplicationService,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private shadowDomService: ShadowDomService
  ) {
    super(el, injector);
    this.shadowDomService.shadowRoot = el.nativeElement.shadowRoot;
    this.contextService.filter$.pipe(debounceTime(500)).subscribe((value) => {
      this.filterActive$.emit(!isEmpty(value));
    });
    this.applicationService.application$.subscribe(
      (application: Application | null) => {
        if (application) {
          const pages = application.pages
            ?.filter((x) => x.content)
            .map((x) => ({
              name: x.name,
              path:
                x.type === ContentType.form
                  ? `./${application.id}/${x.type}/${x.id}`
                  : `./${application.id}/${x.type}/${x.content}`,
              icon: x.icon || this.getNavIcon(x.type || ''),
              fontFamily: x.icon ? 'fa' : 'material',
              visible: x.visible,
            }));
          this.pages.emit(pages);
        } else {
          this.pages.emit([]);
        }
      }
    );
  }

  /**
   * Configuration of the Authentication behavior
   */
  override ngOnInit(): void {
    super.ngOnInit();
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
   * Gets nav icon from page content type.
   *
   * @param type content type of the page
   * @returns icon
   */
  private getNavIcon(type: string): string {
    switch (type) {
      case 'workflow':
        return 'linear_scale';
      case 'form':
        return 'description';
      default:
        return 'dashboard';
    }
  }
}
