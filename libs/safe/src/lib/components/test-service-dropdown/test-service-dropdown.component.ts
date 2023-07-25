import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { UntypedFormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import {
  GET_RECORD_BY_ID,
  GET_RESOURCE_RECORDS,
  GetResourceRecordsQueryResponse,
  GetRecordByIdQueryResponse,
} from './graphql/queries';
import { Record } from '../../models/record.model';
import { CommonModule } from '@angular/common';
import { GraphQLSelectModule, FormWrapperModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** A constant that is used to determine how many items should be on one page. */
const ITEMS_PER_PAGE = 10;

/**
 * Component used to create a dropdown where the user can select a test service from resource/resources.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    GraphQLSelectModule,
  ],
  selector: 'safe-test-service-dropdown',
  templateUrl: './test-service-dropdown.component.html',
  styleUrls: ['./test-service-dropdown.component.scss'],
})
export class SafeTestServiceDropdownComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() resource = '';
  @Input() record = '';
  @Input() textField = '';
  @Output() choice: EventEmitter<string> = new EventEmitter<string>();

  public selectedRecord?: Record;
  // public selectedRecord?: any;
  public recordsControl!: UntypedFormControl;
  public recordsQuery!: QueryRef<GetResourceRecordsQueryResponse>;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {Apollo} apollo - Apollo - This is the Apollo service that is used to create GraphQL queries.
   */
  constructor(private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    this.recordsControl = new UntypedFormControl(this.record);
    this.recordsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.choice.emit(value);
      });
    if (this.record) {
      this.apollo
        .query<GetRecordByIdQueryResponse>({
          query: GET_RECORD_BY_ID,
          variables: {
            id: this.record,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          if (data) {
            this.selectedRecord = data.record;
          }
        });
    }
    if (this.resource) {
      this.recordsQuery =
        this.apollo.watchQuery<GetResourceRecordsQueryResponse>({
          query: GET_RESOURCE_RECORDS,
          variables: {
            id: this.resource,
            first: ITEMS_PER_PAGE,
          },
        });
    }
  }

  /**
   * Emits the selected resource id.
   *
   * @param e select event.
   */
  onSelect(e?: any): void {
    this.choice.emit(e);
  }
}
