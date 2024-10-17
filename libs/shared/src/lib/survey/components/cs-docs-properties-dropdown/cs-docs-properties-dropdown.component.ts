import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { gql } from '@apollo/client';
import { Apollo, ApolloBase } from 'apollo-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionCsDocsPropertiesDropdownModel } from './cs-docs-properties-dropdown.model';

/**
 * Property query response type
 */
interface PropertyQueryResponse {
  [key: string]: {
    id: string;
    name: string;
    _typename: string;
  }[];
}

/**
 * This component is used to create a dropdown where the user can select a properties from a given CS Documentation API Property.
 */
@Component({
  selector: 'shared-cs-docs-properties-dropdown',
  templateUrl: './cs-docs-properties-dropdown.component.html',
  styleUrls: ['./cs-docs-properties-dropdown.component.scss'],
})
export class CsDocsPropertiesDropdownComponent
  extends QuestionAngular<QuestionCsDocsPropertiesDropdownModel>
  implements OnInit, OnDestroy
{
  /** Apollo client for Cs Documentation APi */
  private csDocsApolloClient!: ApolloBase<any>;
  /** Loading flag */
  public loading = false;
  // private propertyToBodyParamMapper = {
  //   assignmentfunctions: 'AssignmentFunction',
  //   countrys: 'Country',
  //   documentroles: 'DocumentRole',
  //   hazards: 'Hazard',
  //   sourceofinformations: 'InformationConfidentiality',
  //   regions: 'Region',
  // } as const;

  /** Selected property */
  public selectedPropertyItems: {
    id: string;
    name: string;
    _typename: string;
  }[] = [];

  /** Properties control */
  public propertyItemsControl: UntypedFormControl = new FormControl([]);

  /** Destroy subject */
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
    apollo: Apollo
  ) {
    super(changeDetectorRef, viewContainerRef);
    this.csDocsApolloClient = apollo.use('csDocApi');
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.model.value) {
      this.loading = true;
      this.csDocsApolloClient
        .query<PropertyQueryResponse>({
          query: gql`
            {
              ${this.model.value}(sortBy: { field: "name", direction: "ASC" }) {
                id
                name
                __typename
              }
            }
          `,
        })
        .subscribe({
          next: ({ data }) => {
            this.loading = false;
            if (data[this.model.value as string]) {
              this.selectedPropertyItems = data[this.model.value as string];
            }
            this.changeDetectorRef.detectChanges();
          },
          error: () => {
            this.loading = false;
            this.changeDetectorRef.detectChanges();
          },
        });
      this.propertyItemsControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (items) => {
            this.changeDetectorRef.detectChanges();
            this.model.obj[`selected${this.model.value}PropertyItems`] = items;
          },
        });
    }
  }

  /**
   * Clear selection and reset control
   *
   */
  public clearSelection() {
    this.propertyItemsControl?.setValue('');
    this.propertyItemsControl?.reset();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
