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
import { ShadowDomService } from '@oort-front/ui';
import { ApplicationRoutingService } from './services/application-routing.service';

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
    const currentPath = this.applicationRoutingService.currentPath;
    if (currentPath.includes(value)) {
      // Path includes the id
      this.applicationRoutingService.navigateByUrlAndNormalizeUrl(
        `${currentPath}`
      );
    } else {
      // Else, navigate to homepage of the app
      this.applicationRoutingService.navigateAndNormalizeUrl(`./${value}`);
    }
  }

  /**
   * Set dashboard filter visibility status
   */
  @Input()
  set toggleFilter(opened: boolean) {
    this.onToggleFilter(opened);
  }

  /** Navigation path */
  @Input()
  set path(value: string) {
    this.applicationRoutingService.navigateAndNormalizeUrl(value);
  }

  /** Pass new value to the filter */
  @Input()
  set filter(value: any) {
    this.contextService.filter.next(value);
  }

  /** Is filter active */
  @Output()
  filterActive$ = new EventEmitter<boolean>();
  /** Emit filter value */
  @Output()
  filter$ = new EventEmitter<any>();
  /** Available pages */
  @Output()
  pages = new EventEmitter<any[]>();

  /**
   * Application as Web Widget.
   *
   * @param el class related element reference
   * @param injector angular application injector
   * @param contextService Shared context service
   * @param applicationService Shared application service
   * @param applicationRoutingService Shared application routing service
   * @param shadowDomService Shared shadow dom service
   */
  constructor(
    el: ElementRef,
    injector: Injector,
    private contextService: ContextService,
    private applicationService: ApplicationService,
    private applicationRoutingService: ApplicationRoutingService,
    private shadowDomService: ShadowDomService
  ) {
    super(el, injector);
    this.shadowDomService.shadowRoot = el.nativeElement.shadowRoot;
    this.contextService.filter$.pipe(debounceTime(500)).subscribe((value) => {
      this.filterActive$.emit(!isEmpty(value));
      this.filter$.emit(value);
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
    const fonts = [
      'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap',
      'https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined',
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0',
      'https://unpkg.com/@progress/kendo-font-icons/dist/index.css',
    ];
    // Function to check if a link with the given href already exists in the head
    const isFontLinkAdded = (href: string) => {
      const existingLinks = document.head.querySelectorAll<HTMLLinkElement>(
        'link[rel="stylesheet"]'
      );
      return Array.from(existingLinks).some(
        (link: HTMLLinkElement) => link.href === href
      );
    };

    // Make sure that the needed fonts are always available wherever the web component is placed
    fonts.forEach((font) => {
      if (!isFontLinkAdded(font)) {
        const link = document.createElement('link');
        link.href = font;
        link.rel = 'stylesheet';
        // Add them at the beginning of the head element in order to not interfere with any font of the same type
        document.head.prepend(link);
      }
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
