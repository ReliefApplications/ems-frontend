import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InMemoryCache } from '@apollo/client';
import { HttpLink } from 'apollo-angular/http';
import { Apollo } from 'apollo-angular';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { GetFormByIdQueryResponse, GetPageByIdQueryResponse, GET_FORM_BY_ID, GET_PAGE_BY_ID } from './graphql/queries';
import { ContentType, Form } from '@safe/builder';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit, OnDestroy {
  /** Current page id */
  public id = '';
  public pageName = '';
  public form!: Form;
  public loading = true;

  private routeSubscription!: Subscription;
  private pageSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private httpLink: HttpLink
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params.id;
      this.apollo.create(
        {
          cache: new InMemoryCache(),
          link: this.httpLink.create({
            uri: environment.apiUrl + '/' + this.id,
          }),
        }
      );
      this.pageSubscription = this.apollo
        .watchQuery<GetPageByIdQueryResponse>({
          query: GET_PAGE_BY_ID,
          variables: {
            id: this.id,
          }
        })
        .valueChanges.subscribe((res) => {
          if (res && res.data && res.data.page) {
            this.pageName = res.data.page.name || '';
            if (res.data.page.type === ContentType.form) {
              this.apollo.query<GetFormByIdQueryResponse>({
                query: GET_FORM_BY_ID,
                variables: {
                  id: res.data.page.content
                }
              }).subscribe((res) => {
                if (res && res.data && res.data.form) {
                  this.form = res.data.form;
                  this.loading = false;
                }
              })
            }
          }
        });
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
