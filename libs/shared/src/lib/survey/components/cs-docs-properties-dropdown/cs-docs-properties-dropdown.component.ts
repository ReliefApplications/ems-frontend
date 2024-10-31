import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { gql } from '@apollo/client';
import { SelectMenuComponent } from '@oort-front/ui';
import { Apollo, ApolloBase } from 'apollo-angular';
import { isNil } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuestionAngular } from 'survey-angular-ui';
import { CS_DOCUMENTS_PROPERTIES } from '../../../services/document-management/document-management.service';
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
 * It can:
 * - Handle properties attached as body params in the CS Doc upload file
 * - Handle the driveId value used to build the path onto upload the files with the previously mentioned configurations
 *
 * - If is handling drive id set, then the dropdown is single select and has to work with occurrence types and occurrences
 *    - The first one filters the occurrences displayed that would contain the needed driveId used to build the upload path
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

  /** Selected property */
  public selectedPropertyItems: {
    id: string;
    name?: string;
    occurrencename?: string;
    _typename: string;
  }[] = [];

  /** Properties control */
  public propertyItemsControl: UntypedFormControl = new FormControl([]);

  /** Destroy subject */
  private destroy$: Subject<void> = new Subject<void>();
  /** Current body key to save the value */
  public bodyKey!: string;

  /**
   * Select menu component
   */
  @ViewChild(SelectMenuComponent, { static: true })
  selectMenu!: SelectMenuComponent;

  /**
   * GraphQL query to fetch items for a given document property(tag)
   * - Result would be sort according to the query sort configuration of the question
   *
   * @returns gql for tag properties list
   */
  private tagQuery = () => gql`
  {
    ${this.model?.value}(sortBy: { field: "name", direction: "${this.model?.obj?.querySort}" }) {
      id
      name
      __typename
    }
  }
`;

  /**
   * GraphQL query to fetch occurrences for a given occurrence type
   *
   * @returns gql for occurrences list
   */
  private occurrenceQuery = () => gql`
  {
    ${this.model?.value}(occurrencetype: ${Number(
    this.model?.obj['OccurrenceType']
  )}, sortBy: { field: "occurrencename", direction: "ASC" }) {
      id
      occurrencename
      __typename
    }
  }
`;

  /**
   * If loaded component instance is linked to related occurrences category
   *
   * @returns boolean flag indicating previously mentioned check
   */
  public get isOccurrenceRelated() {
    return !isNil(this.model?.value) && this.model.value === 'occurrences';
  }

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
    this.bodyKey =
      (CS_DOCUMENTS_PROPERTIES.find((dp) => dp.value === this.model.value)
        ?.bodyKey as string) || 'Occurrence';
    if (!this.isOccurrenceRelated) {
      /** Upload item list on query sort change */
      this.model.obj.registerFunctionOnPropertyValueChanged(
        'querySort',
        this.loadPropertyItems.bind(this)
      );
    } else {
      /** Upload item list on occurrence type selection if current model is occurrence related */
      this.model.obj.registerFunctionOnPropertyValueChanged(
        'OccurrenceType',
        this.loadPropertyItems.bind(this)
      );
    }
    // Listen to select menu UI event in order to update UI
    this.selectMenu.triggerUIChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasChanged: boolean) => {
        if (hasChanged) {
          this.changeDetectorRef.detectChanges();
        }
      });
    this.propertyItemsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.model.obj[this.bodyKey] = items;
          this.changeDetectorRef.detectChanges();
        },
      });

    /**
     * If is not a drive model
     * Or is a drive model
     * - and is not the occurrences list
     * - or is the occurrences list but an occurrence type value is already set
     */
    if (
      !this.isOccurrenceRelated ||
      (this.isOccurrenceRelated &&
        !isNil(this.model?.obj['OccurrenceType']) &&
        this.model?.obj['OccurrenceType'] !== '')
    ) {
      this.loadPropertyItems();
    }
  }

  /**
   * Load given property items list
   */
  private loadPropertyItems() {
    if (
      (this.model.value && !this.isOccurrenceRelated) ||
      (this.isOccurrenceRelated &&
        !isNil(this.model?.obj['OccurrenceType']) &&
        this.model?.obj['OccurrenceType'] !== '')
    ) {
      this.loading = true;
      this.changeDetectorRef.detectChanges();
      this.csDocsApolloClient
        .query<PropertyQueryResponse>({
          query: this.isOccurrenceRelated
            ? this.occurrenceQuery()
            : this.tagQuery(),
        })
        .subscribe({
          next: ({ data }) => {
            this.loading = false;
            if (data[this.model.value as string]) {
              this.selectedPropertyItems = data[this.model.value as string];
            }
            if (this.model.obj[this.bodyKey]) {
              this.propertyItemsControl.setValue(this.model.obj[this.bodyKey]);
            }
            this.changeDetectorRef.detectChanges();
          },
          error: () => {
            this.loading = false;
            this.changeDetectorRef.detectChanges();
          },
        });
    } else {
      this.model.obj[this.bodyKey] = null;
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
    if (!this.isOccurrenceRelated) {
      this.model.obj.unRegisterFunctionOnPropertyValueChanged('querySort');
    } else {
      this.model.obj.unRegisterFunctionOnPropertyValueChanged('OccurrenceType');
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
