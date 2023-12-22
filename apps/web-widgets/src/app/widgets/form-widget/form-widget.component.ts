import { OverlayContainer } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  Injector,
  Input,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { AppOverlayContainer } from '../../utils/overlay-container';
import { UILayoutService } from '@oort-front/ui';
import { ShadowRootExtendedHostComponent } from '../../utils/shadow-root-extended-host.component';

/** Form web widget component */
@Component({
  selector: 'oort-form-widget',
  templateUrl: './form-widget.component.html',
  styleUrls: ['./form-widget.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class FormWidgetComponent
  extends ShadowRootExtendedHostComponent
  implements AfterViewInit
{
  /** id of the form */
  @Input() id = '626b96227ad4dd0c96f3b8a1';
  // @Input() id = '642061d1b7109549fa3035e8';

  /** Reference to the right sideNav */
  @ViewChild('rightSidenav', { read: ViewContainerRef })
  rightSidenav?: ViewContainerRef;

  /** boolean, whether the sidenav should be shown or not */
  public showSidenav = false;

  /**
   * Form web widget component
   *
   * @param layoutService UI layout service
   * @param overlayContainer Angular overlay container
   * @param el ElementRef
   * @param injector Injector
   */
  constructor(
    private layoutService: UILayoutService,
    private overlayContainer: OverlayContainer,
    el: ElementRef,
    injector: Injector
  ) {
    super(el, injector);
  }

  ngAfterViewInit(): void {
    this.layoutService.rightSidenav$.subscribe((view) => {
      if (view && this.rightSidenav) {
        // this is necessary to prevent have more than one history component at the same time.
        this.layoutService.setRightSidenav(null);
        this.showSidenav = true;
        const componentRef: ComponentRef<any> =
          this.rightSidenav.createComponent(view.factory);
        for (const [key, value] of Object.entries(view.inputs)) {
          componentRef.instance[key] = value;
        }
        componentRef.instance.cancel.subscribe(() => {
          componentRef.destroy();
          this.layoutService.setRightSidenav(null);
        });
      } else {
        this.showSidenav = false;
        if (this.rightSidenav) {
          this.rightSidenav.clear();
        }
      }
    });
    const test: AppOverlayContainer = this
      .overlayContainer as AppOverlayContainer;
    test.updateContainer('form-widget');
  }
}
