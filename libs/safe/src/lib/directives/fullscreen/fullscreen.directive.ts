import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ApplicationRef,
  ComponentRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  createComponent,
} from '@angular/core';
import get from 'lodash/get';
import { FullscreenComponent } from '../../components/utils/fullscreen/fullscreen.component';

/**
 * Fullscreen directive.
 * Allow components to take full size of the screen.
 */
@Directive({
  selector: '[safeFullScreen]',
})
export class FullScreenDirective
  implements OnChanges, OnDestroy, AfterViewInit
{
  // Banana box binding properties to trigger full screen on the attached element
  @Input() isFullScreenMode!: boolean;
  @Output() isFullScreenModeChange = new EventEmitter<boolean>();
  // How nested is the element(parentElement) respect the directive's attached element that we want to set to fullscreen mode
  @Input() parentElementNestedNumber = 2;
  private accessorString = '';
  private fullScreenListener!: any;
  private fullScreenHelperComponent!: ComponentRef<FullscreenComponent>;
  /**
   * Create the accessor to the path of the property for the fullscreen mode
   *
   * On fullscreen events, checks if user exited fullscreen mode
   * without using the button and reset settings.
   *
   * @param el Element bind to the directive
   * @param document Document token of the DOM
   * @param renderer Renderer2
   * @param injector EnvironmentInjector
   * @param app ApplicationRef
   */
  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private injector: EnvironmentInjector,
    private app: ApplicationRef
  ) {
    this.accessorString = this.setAccessorPath();
    if (this.fullScreenListener) {
      this.fullScreenListener();
    }
    this.fullScreenListener = this.renderer.listen(
      this.document,
      'fullscreenchange',
      () => {
        if (!this.document.fullscreenElement) {
          this.isFullScreenModeChange.emit(false);
        }
      }
    );
  }

  ngAfterViewInit(): void {
    // Full screen mode default background(agent client stylesheet sets to black)
    this.renderer.setStyle(
      get(this.el.nativeElement, this.accessorString),
      'background',
      'inherit'
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isFullScreenMode) {
      this.triggerFullScreenMode(changes.isFullScreenMode.currentValue);
    }
  }

  /**
   * Given the deepness value of the nested property, creates the accessor to the nested property
   *
   * @returns Path to the element
   */
  private setAccessorPath(): string {
    const numberOfDeepAccessArray = new Array<any>(
      this.parentElementNestedNumber
    );
    let accessorPath = '';
    for (let index = 0; index < numberOfDeepAccessArray.length; index++) {
      accessorPath =
        accessorPath +
        'parentElement' +
        (index !== numberOfDeepAccessArray.length - 1 ? '.' : '');
    }
    return accessorPath;
  }

  /**
   * Trigger the full screen mode of the element
   *
   * @param isFullScreenMode trigger full screen mode
   */
  private triggerFullScreenMode(isFullScreenMode: boolean) {
    if (isFullScreenMode) {
      this.fullScreenHelperComponent = createComponent(FullscreenComponent, {
        environmentInjector: this.injector,
      });
      const currentSidenav = this.document.querySelector(
        'ui-sidenav-container'
      );
      this.fullScreenHelperComponent.instance.mainContentView = get(
        this.el.nativeElement,
        this.accessorString
      );
      const sidenav = currentSidenav?.children.item(0)?.children.item(1);
      if (sidenav) {
        this.fullScreenHelperComponent.instance.rightSidenavView = sidenav;
      }
      this.document.body.appendChild(
        this.fullScreenHelperComponent.location.nativeElement
      );
      this.app.attachView(this.fullScreenHelperComponent.hostView);
      // const defaultFullScreenContainer = get(
      //   this.el.nativeElement,
      //   this.accessorString
      // );
      // if (currentSidenav?.contains(defaultFullScreenContainer)) {
      //   defaultFullScreenContainer = currentSidenav;
      // }
      console.log(this.fullScreenHelperComponent);
      this.fullScreenHelperComponent.location.nativeElement?.requestFullscreen();
    } else {
      if (this.document.fullscreenElement) {
        this.document.exitFullscreen();
        this.app.detachView(this.fullScreenHelperComponent.hostView);
        this.fullScreenHelperComponent.destroy();
      }
    }
  }

  ngOnDestroy(): void {
    get(this.el.nativeElement, this.accessorString) &&
      this.renderer.removeStyle(
        get(this.el.nativeElement, this.accessorString),
        'background'
      );
    if (this.fullScreenListener) {
      this.fullScreenListener();
    }
  }
}
