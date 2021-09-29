import {Apollo, QueryRef} from 'apollo-angular';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Application, Channel, Form, Subscription } from '@safe/builder';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  GetRoutingKeysQueryResponse,
  GET_ROUTING_KEYS,
  GET_FORM_NAMES, GetFormsQueryResponse
} from '../../../../../graphql/queries';
import { map, startWith } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-subscription-modal',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.scss']
})
export class SubscriptionModalComponent implements OnInit {

  // === REACTIVE FORM ===
  subscriptionForm: FormGroup = new FormGroup({});

  // === DATA ===
  private forms = new BehaviorSubject<Form[]>([]);
  public forms$!: Observable<Form[]>;
  private formsQuery!: QueryRef<GetFormsQueryResponse>;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true
  };
  private loading = true;

  @ViewChild('formSelect') formSelect?: MatSelect;

  // === DATA ===
  private applications: Application[] = [];
  public filteredApplications!: Observable<Application[]>;

  get routingKey(): string {
    return this.subscriptionForm.value.routingKey;
  }

  set routingKey(value: string) {
    this.subscriptionForm.controls.routingKey.setValue(value);
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SubscriptionModalComponent>,
    private apollo: Apollo,
    @Inject(MAT_DIALOG_DATA) public data: {
      channels: Channel[];
      subscription?: Subscription
    }
  ) { }

  ngOnInit(): void {
    this.subscriptionForm = this.formBuilder.group({
      routingKey: [this.data.subscription ? this.data.subscription.routingKey : '', Validators.required],
      title: [this.data.subscription ? this.data.subscription.title : '', Validators.required],
      convertTo: [( this.data.subscription && this.data.subscription.convertTo ) ? this.data.subscription.convertTo.id : ''],
      channel: [( this.data.subscription && this.data.subscription.channel ) ? this.data.subscription.channel.id : '']
    });
    // Get forms and set pagination logic
    this.formsQuery = this.apollo.watchQuery<GetFormsQueryResponse>({
      query: GET_FORM_NAMES,
      variables: {
        first: ITEMS_PER_PAGE
      }
    });

    this.forms$ = this.forms.asObservable();
    this.formsQuery.valueChanges.subscribe(res => {
      this.forms.next(res.data.forms.edges.map(x => x.node));
      this.pageInfo = res.data.forms.pageInfo;
      this.loading = res.loading;
    });

    this.apollo.watchQuery<GetRoutingKeysQueryResponse>({
      query: GET_ROUTING_KEYS
    }).valueChanges.subscribe(res => {
      this.applications = res.data.applications.filter(x => x.channels ? x.channels.length > 0 : false);
    });
    this.filteredApplications = this.subscriptionForm.controls.routingKey.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(x => this.filter(x))
    );
  }

  private filter(value: string): Application[] {
    const filterValue = value.toLowerCase();
    return this.applications ? this.applications.filter(x => x.name?.toLowerCase().indexOf(filterValue) === 0) : this.applications;
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Adds scroll listener to select.
   * @param e open select event.
   */
   onOpenSelect(e: any): void {
    if (e && this.formSelect) {
      const panel = this.formSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) => this.loadOnScroll(event));
    }
  }

  /**
   * Fetches more forms on scroll.
   * @param e scroll event.
   */
  private loadOnScroll(e: any): void {
    if (e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) < 50) {
      if (!this.loading && this.pageInfo.hasNextPage) {
        this.loading = true;
        this.formsQuery.fetchMore({
          variables: {
            first: ITEMS_PER_PAGE,
            afterCursor: this.pageInfo.endCursor
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) { return prev; }
            return Object.assign({}, prev, {
              forms: {
                edges: [...prev.forms.edges, ...fetchMoreResult.forms.edges],
                pageInfo: fetchMoreResult.forms.pageInfo,
                totalCount: fetchMoreResult.forms.totalCount
              }
            });
          }
        });
      }
    }
  }
}
