import {
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { SafeLayoutService } from '@safe/builder';

/** Form web widget component */
@Component({
  selector: 'app-form-widget',
  templateUrl: './form-widget.component.html',
  styleUrls: ['./form-widget.component.scss'],
})
export class FormWidgetComponent implements OnInit {
  @ViewChild('rightSidenav', { read: ViewContainerRef })
  rightSidenav?: ViewContainerRef;

  public showSidenav = false;

  /**
   * Form web widget component
   *
   * @param layoutService Shared layout service
   */
  constructor(private layoutService: SafeLayoutService) {}

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
}
