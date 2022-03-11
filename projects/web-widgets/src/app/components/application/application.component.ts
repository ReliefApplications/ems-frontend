import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Application, Page, ContentType } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import {
  GetApplicationByIdQueryResponse,
  GET_APPLICATION_BY_ID,
} from './graphql/queries';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit, OnChanges {
  @Input() id = '618274079eb6019bfc301540';
  @Input()
  set pageId(id: string) {
    const pages = this.application?.pages || [];
    this.selectedPage = pages.find((x) => x.id === id) || null;
  }
  @Output() pages = new EventEmitter<Page[]>();

  // === DATA ===
  public loading = true;
  public application?: Application;
  public selectedPage: Page | null = null;

  public readonly contentType = ContentType;

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.apollo
      .watchQuery<GetApplicationByIdQueryResponse>({
        query: GET_APPLICATION_BY_ID,
        variables: {
          id: this.id,
        },
      })
      .valueChanges.subscribe((res) => {
        if (res.data.application) {
          this.application = res.data.application;
          const pages = this.application.pages || [];
          this.pages.emit(pages);
          this.selectedPage = pages.length > 0 ? pages[0] : null;
          this.loading = res.loading;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.id) {
      this.apollo
        .watchQuery<GetApplicationByIdQueryResponse>({
          query: GET_APPLICATION_BY_ID,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.subscribe((res) => {
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
