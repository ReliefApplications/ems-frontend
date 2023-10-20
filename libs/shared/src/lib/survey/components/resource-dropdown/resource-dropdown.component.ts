import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  Resource,
  ResourceQueryResponse,
  ResourcesQueryResponse,
} from '../../../models/resource.model';
import { GET_RESOURCES, GET_SHORT_RESOURCE_BY_ID } from './graphql/queries';
import { takeUntil } from 'rxjs/operators';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionResourceDropdownModel } from './resource-dropdown.model';
import { Subject } from 'rxjs';

/** A constant that is used to determine how many items should be on one page. */
const ITEMS_PER_PAGE = 10;

/**
 * This component is used to create a dropdown where the user can select a resource.
 */
@Component({
  selector: 'shared-resource-dropdown',
  templateUrl: './resource-dropdown.component.html',
  styleUrls: ['./resource-dropdown.component.scss'],
})
export class ResourceDropdownComponent
  extends QuestionAngular<QuestionResourceDropdownModel>
  implements OnInit
{
  public selectedResource?: Resource;
  public resourceControl!: UntypedFormControl;

  public resourcesQuery!: QueryRef<ResourcesQueryResponse>;
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
    this.resourceControl = new UntypedFormControl(this.model.value ?? '');
    this.resourceControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.model.value = value;
        this.model.obj.gridFieldsSettings = null;
      });
    if (this.model.value) {
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_SHORT_RESOURCE_BY_ID,
          variables: {
            id: this.model.value,
          },
        })
        .subscribe(({ data }) => {
          if (data.resource) {
            this.selectedResource = data.resource;
          }
        });
    }
    this.resourcesQuery = this.apollo.watchQuery<ResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  public onResourceSearchChange(search: string): void {
    const variables = this.resourcesQuery.variables;
    this.resourcesQuery.refetch({
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
}
