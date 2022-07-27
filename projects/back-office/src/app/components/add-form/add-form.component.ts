import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  GetResourcesQueryResponse,
  GET_RESOURCES,
  GetResourceByIdQueryResponse,
  GET_RESOURCE_BY_ID,
} from '../../graphql/queries';
import { MatSelect } from '@angular/material/select';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resource } from '@safe/builder';

/** Default items per query, for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Add form component (modal)
 */
@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss'],
})
export class AddFormComponent implements OnInit {
  // === REACTIVE FORM ===
  public addForm: UntypedFormGroup = new UntypedFormGroup({});

  // === DATA ===
  private resources = new BehaviorSubject<Resource[]>([]);
  public resources$!: Observable<Resource[]>;
  private resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private loading = true;

  public templates: any[] = [];

  @ViewChild('resourceSelect') resourceSelect?: MatSelect;

  /**
   * Add form modal
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Material dialog ref
   * @param apollo Apollo service
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddFormComponent>,
    private apollo: Apollo
  ) {}

  /** Load the resources and build the form. */
  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      newResource: [true],
      resource: [null],
      inheritsTemplate: [false],
      template: [null],
    });

    this.addForm
      .get('newResource')
      ?.valueChanges.subscribe((value: boolean) => {
        if (value) {
          this.addForm.get('resource')?.clearValidators();
          this.addForm.patchValue({
            resource: null,
            inheritsTemplate: false,
            template: null,
          });
        } else {
          this.addForm.get('resource')?.setValidators([Validators.required]);
        }
        this.addForm.get('resource')?.updateValueAndValidity();
      });

    this.addForm
      .get('inheritsTemplate')
      ?.valueChanges.subscribe((value: boolean) => {
        if (value) {
          this.addForm.get('template')?.setValidators([Validators.required]);
        } else {
          this.addForm.get('template')?.clearValidators();
          this.addForm.patchValue({
            template: null,
          });
        }
        this.addForm.get('template')?.updateValueAndValidity();
      });

    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
      },
    });

    this.resources$ = this.resources.asObservable();
    this.resourcesQuery.valueChanges.subscribe((res) => {
      this.resources.next(res.data.resources.edges.map((x) => x.node));
      this.pageInfo = res.data.resources.pageInfo;
      this.loading = res.loading;
    });
  }

  /**
   * Called on resource input change.
   * Load the templates linked to that resource.
   *
   * @param e resource event
   */
  getResource(e: any): void {
    this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id: e.value,
        },
      })
      .subscribe((res) => {
        this.templates = res.data.resource.forms || [];
      });
  }

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Adds scroll listener to select.
   *
   * @param e open select event.
   */
  onOpenSelect(e: any): void {
    if (e && this.resourceSelect) {
      const panel = this.resourceSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) =>
        this.loadOnScroll(event)
      );
    }
  }

  /**
   * Fetches more resources on scroll.
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
        this.resourcesQuery.fetchMore({
          variables: {
            first: ITEMS_PER_PAGE,
            afterCursor: this.pageInfo.endCursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            return Object.assign({}, prev, {
              resources: {
                edges: [
                  ...prev.resources.edges,
                  ...fetchMoreResult.resources.edges,
                ],
                pageInfo: fetchMoreResult.resources.pageInfo,
                totalCount: fetchMoreResult.resources.totalCount,
              },
            });
          },
        });
      }
    }
  }
}
