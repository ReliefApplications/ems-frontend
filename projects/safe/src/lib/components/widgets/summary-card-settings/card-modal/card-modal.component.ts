import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Apollo } from 'apollo-angular';
import {
  GET_RESOURCE,
  GetResourceByIdQueryResponse,
  GetRecordByIdQueryResponse,
  GET_RECORD_BY_ID,
  GetLayoutQueryResponse,
  GET_LAYOUT,
} from './graphql/queries';
import { Layout } from '../../../../models/layout.model';
import { Resource } from '../../../../models/resource.model';
import get from 'lodash/get';

/**
 * Card modal component.
 * Used as a Material Dialog.
 */
@Component({
  selector: 'safe-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss'],
})
export class SafeCardModalComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroup') tabGroup: any;

  // === CURRENT TAB ===
  private activeTabIndex: number | undefined;

  // === RECORD DATA ===
  public selectedRecord: any;

  public form!: FormGroup;

  public selectedLayout: Layout | null = null;
  public selectedResource: Resource | null = null;
  public fields: any[] = [];

  /**
   * Card modal component.
   * Used as a Material Dialog.
   *
   * @param data card form value
   * @param dialogRef Material Dialog Ref of the component
   * @param fb Angular form builder
   * @param cdRef Change detector
   * @param apollo Apollo service
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SafeCardModalComponent>,
    public fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private apollo: Apollo
  ) {}

  /**
   * Creates a formGroup with the data provided in the modal creation and gets the resource data used in the card.
   */
  ngOnInit(): void {
    this.form = this.fb.group({ ...this.data });
    if (this.form.value.resource) {
      this.getResource(this.form.value.resource);
    }

    this.form.controls.resource.valueChanges.subscribe((value: any) => {
      this.form.get('layout')?.setValue(null);
      this.form.get('record')?.setValue(null);
      this.selectedLayout = null;
      this.getResource(value);
    });

    this.form.controls.layout.valueChanges.subscribe((value: string) => {
      if (value) {
        this.getLayout(value);
      } else {
        this.selectedLayout = null;
      }
    });

    // Fetches the specified record data.
    if (this.form.value.record) {
      this.getRecord(this.form.value.record);
    }
    this.form.controls.record.valueChanges.subscribe((value: any) => {
      if (value) {
        this.getRecord(value);
      } else {
        this.selectedRecord = null;
      }
    });
  }

  /**
   * Get record by ID, doing graphQL request
   *
   * @param id record id
   */
  private getRecord(id: string): void {
    this.apollo
      .query<GetRecordByIdQueryResponse>({
        query: GET_RECORD_BY_ID,
        variables: {
          id,
          display: true,
        },
      })
      .subscribe((res) => {
        if (res) {
          this.selectedRecord = res.data.record;
        } else {
          this.selectedRecord = null;
        }
      });
  }

  /**
   * Get resource by id, doing graphQL query
   *
   * @param id resource id
   */
  private getResource(id: string): void {
    const layoutID = this.form.value.layout;
    this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id,
          layout: layoutID ? [layoutID] : undefined,
        },
      })
      .subscribe((res) => {
        if (res.errors) {
          this.form.patchValue({
            resource: null,
            layout: null,
            record: null,
          });
        } else {
          this.selectedResource = res.data.resource;
          this.fields = get(res, 'data.resource.metadata', []);
          if (layoutID)
            this.selectedLayout =
              res.data?.resource.layouts?.edges[0]?.node || null;
        }
      });
  }

  /**
   * Gets the resource's layout by id.
   *
   * @param id layout id
   */
  private getLayout(id: string): void {
    this.apollo
      .query<GetLayoutQueryResponse>({
        query: GET_LAYOUT,
        variables: {
          id,
          resource: this.selectedResource?.id,
        },
      })
      .subscribe((res) => {
        this.selectedLayout =
          res.data?.resource.layouts?.edges[0]?.node || null;
      });
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the modal sending the form data.
   */
  onSubmit(): void {
    this.dialogRef.close(this.form.value);
  }

  /**
   * Checks if the user is in the editor tab before loading it.
   *
   * @returns Returns a boolean.
   */
  isEditorTab(): boolean {
    return this.form.get('isDynamic')?.value
      ? this.activeTabIndex === 2
      : this.activeTabIndex === 3;
  }

  /**
   * Sets an internal variable with the current tab.
   *
   * @param e Change tab event.
   */
  handleTabChange(e: MatTabChangeEvent) {
    this.activeTabIndex = e.index;
  }

  /**
   * Updates modified layout
   *
   * @param layout the modified layout
   */
  handleLayoutChange(layout: Layout) {
    this.selectedLayout = layout;
  }

  /**
   * Initializes the active tab variable.
   */
  ngAfterViewInit() {
    this.activeTabIndex = this.tabGroup.selectedIndex;
    this.cdRef.detectChanges();
  }
}
