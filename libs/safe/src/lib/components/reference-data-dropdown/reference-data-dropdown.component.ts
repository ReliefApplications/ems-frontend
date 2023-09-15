import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { ReferenceData } from '../../models/reference-data.model';
import {
  GetReferenceDataByIdQueryResponse,
  GetReferenceDatasQueryResponse,
  GET_REFERENCE_DATAS,
  GET_SHORT_REFERENCE_DATA_BY_ID,
} from './graphql/queries';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionReferenceDataDropdownModel } from './reference-data-dropdown.model';
import { Subject } from 'rxjs';

/** Pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Reference data dropdown component.
 */
@Component({
  selector: 'safe-reference-data-dropdown',
  templateUrl: './reference-data-dropdown.component.html',
  styleUrls: ['./reference-data-dropdown.component.scss'],
})
export class SafeReferenceDataDropdownComponent
  extends QuestionAngular<QuestionReferenceDataDropdownModel>
  implements OnInit, OnDestroy
{
  public control = new FormControl<string | null>(null);
  public selectedReferenceData: ReferenceData | null = null;
  public referenceDatasQuery!: QueryRef<GetReferenceDatasQueryResponse>;
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {ChangeDetectorRef} changeDetectorRef - Angular - This is angular change detector ref of the component instance needed for the survey AngularQuestion class
   * @param {ViewContainerRef} viewContainerRef - Angular - This is angular view container ref of the component instance needed for the survey AngularQuestion class
   * @param {Apollo} apollo - Apollo - This is the Apollo service that we'll use to make our GraphQL queries.
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
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value: string | null) => {
        this.model.value = value;
      },
    });
    if (this.model.obj.referenceData) {
      this.apollo
        .query<GetReferenceDataByIdQueryResponse>({
          query: GET_SHORT_REFERENCE_DATA_BY_ID,
          variables: {
            id: this.model.obj.referenceData,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          this.selectedReferenceData = data.referenceData;
          this.control.setValue(this.model.obj.referenceData, {
            emitEvent: false,
          });
        });
    }

    this.referenceDatasQuery =
      this.apollo.watchQuery<GetReferenceDatasQueryResponse>({
        query: GET_REFERENCE_DATAS,
        variables: {
          first: ITEMS_PER_PAGE,
        },
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
