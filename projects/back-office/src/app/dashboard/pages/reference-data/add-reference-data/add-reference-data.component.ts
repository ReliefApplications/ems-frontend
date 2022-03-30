import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  GetApiConfigurationsQueryResponse,
  GET_API_CONFIGURATIONS_NAMES,
} from '../../../../graphql/queries';
import { ApiConfiguration } from '@safe/builder';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';

const ITEMS_PER_PAGE = 10;
const SEPARATOR_KEYS_CODE = [ENTER, COMMA, TAB, SPACE];

@Component({
  selector: 'app-add-reference-data',
  templateUrl: './add-reference-data.component.html',
  styleUrls: ['./add-reference-data.component.scss'],
})
export class AddReferenceDataComponent implements OnInit {
  // === REACTIVE FORM ===
  referenceForm: FormGroup = new FormGroup({});
  private apiConfigurationsQuery!: QueryRef<GetApiConfigurationsQueryResponse>;
  private apiConfigurations = new BehaviorSubject<ApiConfiguration[]>([]);
  public apiConfigurations$!: Observable<ApiConfiguration[]>;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private loading = true;
  public valueFields: string[] = [];

  readonly separatorKeysCodes: number[] = SEPARATOR_KEYS_CODE;

  @ViewChild('formSelect') apiConfSelect?: MatSelect;
  @ViewChild('fieldInput') fieldInput?: ElementRef<HTMLInputElement>;

  get name(): AbstractControl | null {
    return this.referenceForm.get('name');
  }

  get type(): string {
    return this.referenceForm.get('type')?.value;
  }

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddReferenceDataComponent>
  ) {}

  /*  Build the form.
   */
  ngOnInit(): void {
    this.referenceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z-_]+$')]],
      type: ['', Validators.required],
      valueField: [[], Validators.required],
      fields: [],
      apiConfiguration: '',
      queryName: '',
      path: '',
      data: [],
    });

    // Adapt validators to the type of reference data
    this.referenceForm.get('type')?.valueChanges.subscribe((type) => {
      if (['graphql', 'rest'].includes(type)) {
        this.referenceForm
          .get('apiConfiguration')
          ?.setValidators(Validators.required);
        this.referenceForm.get('queryName')?.setValidators(Validators.required);
        this.referenceForm.get('fields')?.setValidators(Validators.required);

        this.apiConfigurationsQuery =
          this.apollo.watchQuery<GetApiConfigurationsQueryResponse>({
            query: GET_API_CONFIGURATIONS_NAMES,
            variables: {
              first: ITEMS_PER_PAGE,
            },
          });

        this.apiConfigurations$ = this.apiConfigurations.asObservable();
        this.apiConfigurationsQuery.valueChanges.subscribe((res) => {
          this.apiConfigurations.next(
            res.data.apiConfigurations.edges.map((x) => x.node)
          );
          this.pageInfo = res.data.apiConfigurations.pageInfo;
          this.loading = res.loading;
        });
      } else {
        this.referenceForm.get('apiConfiguration')?.clearValidators();
        this.referenceForm.get('queryName')?.clearValidators();
        this.referenceForm.get('fields')?.clearValidators();
      }
      this.referenceForm?.get('apiConfiguration')?.updateValueAndValidity();
      this.referenceForm?.get('queryName')?.updateValueAndValidity();
      this.referenceForm?.get('fields')?.updateValueAndValidity();
    });
  }

  /**
   * Adds scroll listener to select.
   *
   * @param e open select event.
   */
  onOpenSelect(e: any): void {
    if (e && this.apiConfSelect) {
      const panel = this.apiConfSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) =>
        this.loadOnScroll(event)
      );
    }
  }

  /**
   * Fetches more forms on scroll.
   *
   * @param e scroll event.
   */
  private loadOnScroll(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
      50
    ) {
      if (!this.loading && this.pageInfo.hasNextPage) {
        this.loading = true;
        this.apiConfigurationsQuery.fetchMore({
          variables: {
            first: ITEMS_PER_PAGE,
            afterCursor: this.pageInfo.endCursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            return Object.assign({}, prev, {
              apiConfigurations: {
                edges: [
                  ...prev.apiConfigurations.edges,
                  ...fetchMoreResult.apiConfigurations.edges,
                ],
                pageInfo: fetchMoreResult.apiConfigurations.pageInfo,
                totalCount: fetchMoreResult.apiConfigurations.totalCount,
              },
            });
          },
        });
      }
    }
  }

  /**
   * Add an object to the chip list.
   *
   * @param event input event.
   */
  add(event: MatChipInputEvent | any): void {
    // use setTimeout to prevent add input value on focusout
    setTimeout(
      () => {
        const input =
          event.type === 'focusout'
            ? this.fieldInput?.nativeElement
            : event.input;
        const value =
          event.type === 'focusout'
            ? this.fieldInput?.nativeElement.value
            : event.value;

        // Add the mail
        if ((value || '').trim()) {
          this.valueFields.push(value.trim());
        }
        this.referenceForm?.get('distributionList')?.setValue(this.valueFields);
        this.referenceForm?.get('distributionList')?.updateValueAndValidity();
        // Reset the input value
        if (input) {
          input.value = '';
        }
      },
      event.type === 'focusout' ? 500 : 0
    );
  }

  /**
   * Remove an object from the chip list.
   *
   * @param field field to remove.
   */
  remove(field: string): void {
    const index = this.valueFields.indexOf(field);
    if (index >= 0) {
      this.valueFields.splice(index, 1);
    }
    this.referenceForm?.get('fields')?.setValue(this.valueFields);
    this.referenceForm?.get('fields')?.updateValueAndValidity();
  }

  /*  Close the modal without sending data.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
