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
    name: string;
    _typename: string;
  }[] = [];

  /** Properties control */
  public propertyItemsControl: UntypedFormControl = new FormControl([]);

  /** Destroy subject */
  private destroy$: Subject<void> = new Subject<void>();
  /** Current body key to save the value */
  private bodyKey!: string;

  /**
   * Select menu component
   */
  @ViewChild(SelectMenuComponent, { static: true })
  selectMenu!: SelectMenuComponent;

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
    this.bodyKey = CS_DOCUMENTS_PROPERTIES.find(
      (dp) => dp.value === this.model.value
    )?.bodyKey as string;
    /** Upload item list on query sort change */
    this.model.obj.registerFunctionOnPropertyValueChanged(
      'querySort',
      this.loadPropertyItems.bind(this)
    );
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
    this.loadPropertyItems();
  }

  /**
   * Load given property items list
   */
  private loadPropertyItems() {
    if (this.model.value) {
      this.loading = true;
      this.changeDetectorRef.detectChanges();
      this.csDocsApolloClient
        .query<PropertyQueryResponse>({
          query: gql`
            {
              ${this.model.value}(sortBy: { field: "name", direction: "${this.model.obj.querySort}" }) {
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
    this.model.obj.unRegisterFunctionOnPropertyValueChanged('querySort');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
