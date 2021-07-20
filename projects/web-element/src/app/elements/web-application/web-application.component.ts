import { Component, ComponentRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Page, SafeLayoutService } from '@safe/builder';

@Component({
  selector: 'app-web-application',
  templateUrl: './web-application.component.html',
  styleUrls: ['./web-application.component.scss']
})
export class WebApplicationComponent implements OnInit {

  @Input() id = '';

  @Input() pageId = '';

  @Output() pages = new EventEmitter<Page[]>();

  @ViewChild('rightSidenav', { read: ViewContainerRef }) rightSidenav?: ViewContainerRef;

  // === DISPLAY ===
  public showSidenav = false;

  constructor(
    private layoutService: SafeLayoutService
  ) { }

  ngOnInit(): void {
    this.layoutService.rightSidenav.subscribe(view => {
      if (view && this.rightSidenav) {
        // this is necessary to prevent have more than one history component at the same time.
        this.layoutService.setRightSidenav(null);
        this.showSidenav = true;
        const componentRef: ComponentRef<any> = this.rightSidenav.createComponent(view.factory);
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
