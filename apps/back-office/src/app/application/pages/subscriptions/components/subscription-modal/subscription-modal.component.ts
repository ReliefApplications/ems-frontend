import { Apollo, QueryRef } from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Application,
  Channel,
  Form,
  Subscription,
  UnsubscribeComponent,
  FormsQueryResponse,
  ApplicationsApplicationNodesQueryResponse,
} from '@oort-front/shared';
import { BehaviorSubject, Observable } from 'rxjs';
import { GET_ROUTING_KEYS, GET_FORM_NAMES } from '../../graphql/queries';
import { map, startWith, takeUntil } from 'rxjs/operators';
import get from 'lodash/get';
import { ApolloQueryResult } from '@apollo/client';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../../../utils/update-queries';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@oort-front/ui';
import { SubscriptionsRoutingModule } from '../../subscriptions-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  SpinnerModule,
  DividerModule,
  MenuModule,
  TooltipModule,
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
  AutocompleteModule,
  GraphQLSelectModule,
} from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

/** Items per query for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Subscription modal component
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    SubscriptionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    SpinnerModule,
    MenuModule,
    DividerModule,
    TranslateModule,
    GraphQLSelectModule,
    DialogModule,
    TooltipModule,
    ButtonModule,
    AutocompleteModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
  selector: 'app-subscription-modal',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.scss'],
})
export class SubscriptionModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Subscription reactive form group */
  subscriptionForm = this.fb.group({
    routingKey: [
      this.data.subscription ? this.data.subscription.routingKey : '',
      Validators.required,
    ],
    title: [
      this.data.subscription ? this.data.subscription.title : '',
      Validators.required,
    ],
    convertTo: [
      this.data.subscription && this.data.subscription.convertTo
        ? this.data.subscription.convertTo.id
        : '',
    ],
    channel: [
      this.data.subscription && this.data.subscription.channel
        ? this.data.subscription.channel.id
        : '',
    ],
  });
  /** GraphQL forms query */
  public formsQuery!: QueryRef<FormsQueryResponse>;
  /** Available applications */
  private applications = new BehaviorSubject<Application[]>([]);
  /** Filtered applications as observable */
  public filteredApplications$!: Observable<Application[]>;
  /** Applications as observable */
  public applications$!: Observable<Application[]>;
  /** GraphQL applications query */
  private applicationsQuery!: QueryRef<ApplicationsApplicationNodesQueryResponse>;
  /** Cached applications */
  private cachedApplications: Application[] = [];
  /** Applications query pagination info */
  private applicationsPageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  /** Loading indicator for applications */
  private applicationsLoading = true;

  /** @returns subscription routing key */
  get routingKey(): string | null | undefined {
    return this.subscriptionForm.value.routingKey;
  }

  /** Set subscription key */
  set routingKey(value: string | null | undefined) {
    this.subscriptionForm.controls.routingKey.setValue(value);
  }

  /** @returns default convert to form */
  get defaultForm(): Form | null {
    return get(this.data, 'subscription.convertTo', null);
  }

  /**
   * Subscription modal component
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   * @param apollo Apollo service
   * @param data Injected dialog data
   * @param data.channels list of channels
   * @param data.subscription subscription
   * @param document Document
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<SubscriptionModalComponent>,
    private apollo: Apollo,
    @Inject(DIALOG_DATA)
    public data: {
      channels: Channel[];
      subscription?: Subscription;
    },
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  ngOnInit(): void {
    // Get applications and set pagination logic
    this.applicationsQuery =
      this.apollo.watchQuery<ApplicationsApplicationNodesQueryResponse>({
        query: GET_ROUTING_KEYS,
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.applicationsPageInfo.endCursor,
        },
      });

    // this.applications$ = this.applications.asObservable();
    this.applicationsQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((results) => {
        this.updateValues(results.data, results.loading);
      });

    this.formsQuery = this.apollo.watchQuery<FormsQueryResponse>({
      query: GET_FORM_NAMES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });
  }

  /**
   * Filter list of applications
   *
   * @param value value to search with
   * @returns filtered list of applications.
   */
  private filter(value: string | null | undefined): Application[] {
    if (value) {
      const filterValue = value.toLowerCase();
      const applications = this.applications.getValue();
      return applications
        ? applications.filter(
            (x) => x.name?.toLowerCase().indexOf(filterValue) === 0
          )
        : applications;
    } else {
      return this.applications.getValue();
    }
  }

  /**
   * Adds scroll listener to auto complete.
   */
  onOpenApplicationSelect(): void {
    const panel = this.document.getElementById('autocompleteList');
    if (panel) {
      panel.onscroll = (event: any) => this.loadOnScrollApplication(event);
    }
  }

  /**
   * Fetches more applications on scroll.
   *
   * @param e scroll event.
   */
  private loadOnScrollApplication(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
      50
    ) {
      if (!this.applicationsLoading && this.applicationsPageInfo.hasNextPage) {
        this.applicationsLoading = true;
        const variables = {
          first: ITEMS_PER_PAGE,
          afterCursor: this.applicationsPageInfo.endCursor,
        };
        const cachedValues: ApplicationsApplicationNodesQueryResponse =
          getCachedValues(this.apollo.client, GET_ROUTING_KEYS, variables);
        if (cachedValues) {
          this.updateValues(cachedValues, false);
        } else {
          this.applicationsQuery
            .fetchMore({ variables })
            .then(
              (
                results: ApolloQueryResult<ApplicationsApplicationNodesQueryResponse>
              ) => {
                this.updateValues(results.data, results.loading);
              }
            );
        }
      }
    }
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  onSearchChange(search: string): void {
    const variables = this.formsQuery.variables;
    this.formsQuery.refetch({
      ...variables,
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: search,
          },
        ],
      },
    });
  }

  /**
   * Updates local list with given data
   *
   * @param data New values to update forms
   * @param loading Loading state
   */
  private updateValues(
    data: ApplicationsApplicationNodesQueryResponse,
    loading: boolean
  ) {
    this.cachedApplications = updateQueryUniqueValues(
      this.cachedApplications,
      data.applications.edges
        .map((x) => x.node)
        .filter((x) => (x.channels ? x.channels.length > 0 : false))
    );
    this.applications.next(this.cachedApplications);
    this.applicationsPageInfo = data.applications.pageInfo;
    this.applicationsLoading = loading;
    this.applications$ =
      this.subscriptionForm.controls.routingKey.valueChanges.pipe(
        startWith(''),
        map((x) => this.filter(x))
      );
  }
}
