import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { UntypedFormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { GET_RECORD_BY_ID, GET_RESOURCE_RECORDS } from './graphql/queries';
import { Record, RecordQueryResponse } from '../../../models/record.model';
import { CommonModule } from '@angular/common';
import { GraphQLSelectModule, FormWrapperModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionTestServiceDropdownModel } from './test-service-dropdown.model';
import { Subject } from 'rxjs';
import { ResourceRecordsNodesQueryResponse } from '../../../models/resource.model';

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
  selector: 'shared-test-service-dropdown',
  templateUrl: './test-service-dropdown.component.html',
  styleUrls: ['./test-service-dropdown.component.scss'],
})
export class TestServiceDropdownComponent
  extends QuestionAngular<QuestionTestServiceDropdownModel>
  implements OnInit, OnDestroy
{
  resource = '';
  textField = '';

  public selectedRecord?: Record;
  public recordsControl!: UntypedFormControl;
  public recordsQuery!: QueryRef<ResourceRecordsNodesQueryResponse>;

  private destroy$: Subject<void> = new Subject<void>();

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {ChangeDetectorRef} changeDetectorRef - Angular - This is angular change detector ref of the component instance needed for the survey AngularQuestion class
   * @param {ViewContainerRef} viewContainerRef - Angular - This is angular view container ref of the component instance needed for the survey AngularQuestion class
   * @param {Apollo} apollo - Apollo - This is the Apollo service that is used to create GraphQL queries.
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef,
    private apollo: Apollo
  ) {
    super(changeDetectorRef, viewContainerRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.resource = this.model.obj.resource;
    this.textField = this.model.obj.displayField;
    this.model.obj.registerFunctionOnPropertyValueChanged(
      'resource',
      (value: string) => {
        this.resource = value;
        this.model.value = null;
        this.model.obj.gridFieldsSettings = null;
      }
    );
    this.model.obj.registerFunctionOnPropertyValueChanged(
      'displayField',
      (value: string) => {
        this.textField = value;
        this.model.value = null;
        this.recordsQuery =
          this.apollo.watchQuery<ResourceRecordsNodesQueryResponse>({
            query: GET_RESOURCE_RECORDS,
            variables: {
              id: this.resource,
              first: ITEMS_PER_PAGE,
            },
          });
      }
    );
    this.recordsControl = new UntypedFormControl(this.model.value);
    this.recordsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.model.value = value;
      });
    if (this.model.value) {
      this.apollo
        .query<RecordQueryResponse>({
          query: GET_RECORD_BY_ID,
          variables: {
            id: this.model.value,
          },
        })
        .subscribe(({ data }) => {
          if (data) {
            this.selectedRecord = data.record;
          }
        });
    }
    if (this.resource) {
      this.recordsQuery =
        this.apollo.watchQuery<ResourceRecordsNodesQueryResponse>({
          query: GET_RESOURCE_RECORDS,
          variables: {
            id: this.resource,
            first: ITEMS_PER_PAGE,
          },
        });
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
    this.model.obj.unRegisterFunctionOnPropertyValueChanged('resource');
    this.model.obj.unRegisterFunctionOnPropertyValueChanged('displayField');
  }
}
