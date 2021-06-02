import { Component, ComponentRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Application, Page, SafeLayoutService, ContentType } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import { GetApplicationByIdQueryResponse, GET_APPLICATION_BY_ID } from '../../graphql/queries';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit, OnChanges {

  @Input() id = '';
  @Input()
  set pageId(id: string) {
    console.log(id);
    const pages = this.application?.pages || [];
    this.selectedPage = pages.find(x => x.id === id) || null;
  }

  @ViewChild('rightSidenav', { read: ViewContainerRef }) rightSidenav?: ViewContainerRef;

  @Output() pages = new EventEmitter<Page[]>();

  // === DATA ===
  public loading = true;
  public application?: Application;
  public selectedPage: Page | null = null;

  public readonly ContentType = ContentType;

  // === DISPLAY ===
  public showSidenav = false;

  constructor(
    private apollo: Apollo,
    private layoutService: SafeLayoutService
  ) { }

  ngOnInit(): void {
    this.apollo.watchQuery<GetApplicationByIdQueryResponse>({
      query: GET_APPLICATION_BY_ID,
      variables: {
        id: this.id
      }
    }).valueChanges.subscribe((res) => {
      if (res.data.application) {
        this.application = res.data.application;
        const pages = this.application.pages || [];
        this.pages.emit(pages);
        this.selectedPage = pages.length > 0 ? pages[0] : null;
        this.loading = res.loading;
      }
    });
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.id) {
      this.apollo.watchQuery<GetApplicationByIdQueryResponse>({
        query: GET_APPLICATION_BY_ID,
        variables: {
          id: this.id
        }
      }).valueChanges.subscribe((res) => {
        if (res.data.application) {
          this.application = res.data.application;
          const pages = this.application.pages || [];
          this.pages.emit(pages);
          this.selectedPage = pages.length > 0 ? pages[0] : null;
          this.loading = res.loading;
        }
      });
    }
  }
}
