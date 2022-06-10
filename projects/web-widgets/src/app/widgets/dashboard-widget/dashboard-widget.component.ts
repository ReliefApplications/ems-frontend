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
import { SafeLayoutService } from '@safe/builder';
import { AppOverlayContainer } from '../../utils/overlay-container';

@Component({
  selector: 'app-dashboard-widget',
  templateUrl: './dashboard-widget.component.html',
  styleUrls: ['./dashboard-widget.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class DashboardWidgetComponent implements OnInit, AfterViewInit {
  @Input() id = '';

  @ViewChild('rightSidenav', { read: ViewContainerRef })
  rightSidenav?: ViewContainerRef;

  public showSidenav = false;

  constructor(
    private layoutService: SafeLayoutService,
    private overlayContainer: OverlayContainer
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
    test.updateContainer('dashboard-widget');
  }
}
