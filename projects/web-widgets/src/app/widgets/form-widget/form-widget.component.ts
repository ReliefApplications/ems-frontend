import { OverlayContainer } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { SafeFormService, SafeLayoutService } from '@safe/builder';
import { AppOverlayContainer } from '../../utils/overlay-container';

/** Form web widget component */
@Component({
  selector: 'app-form-widget',
  templateUrl: './form-widget.component.html',
  styleUrls: ['./form-widget.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class FormWidgetComponent implements OnInit, AfterViewInit {
  @Input() id = '';

  @ViewChild('rightSidenav', { read: ViewContainerRef })
  rightSidenav?: ViewContainerRef;

  public showSidenav = false;

  /**
   * Form web widget component
   *
   * @param layoutService Shared layout service
   * @param overlayContainer Angular overlay container
   * @param formService Shared form service
   */
  constructor(
    private layoutService: SafeLayoutService,
    private overlayContainer: OverlayContainer,
    private formService: SafeFormService
  ) {}

  ngOnInit(): void {
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
  }

  ngAfterViewInit(): void {
    const test: AppOverlayContainer = this
      .overlayContainer as AppOverlayContainer;
    test.updateContainer('form-widget');
  }
}
