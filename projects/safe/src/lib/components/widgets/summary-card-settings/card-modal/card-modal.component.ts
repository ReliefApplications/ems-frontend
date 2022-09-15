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

  // === GRID FOR RECORD SELECTION SETTINGS ===
  public gridSettings: any;

  // === RECORD DATA ===
  public selectedRecord: any;

  public form!: FormGroup;

  private layouts: Layout[] = [];
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

    this.form.controls.resource.valueChanges.subscribe((value: any) =>
      this.getResource(value)
    );

    this.form.controls.layout.valueChanges.subscribe((value: any) => {
      if (this.layouts) {
        this.gridSettings = this.findLayout(this.layouts, value);
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
    this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id,
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
          this.layouts = get(res, 'data.resource.layouts', []);
          this.gridSettings = this.findLayout(
            this.layouts,
            this.form.value.layout
          );
          if (!this.gridSettings) {
            this.form.patchValue({
              layout: null,
              record: null,
            });
          }
        }
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
   * Initializes the active tab variable.
   */
  ngAfterViewInit() {
    this.activeTabIndex = this.tabGroup.selectedIndex;
    this.cdRef.detectChanges();
  }

  /**
   * Search the an specific layout in an array.
   *
   * @param layouts Array of layout objects.
   * @param layoutToFind String with the layout id to find.
   * @returns Returns the layout if found, if not null is returned.
   */
  private findLayout(layouts: any[], layoutToFind: string): any {
    let result = null;
    layouts.map((layout: any) => {
      if (layout.id === layoutToFind) {
        result = layout;
      }
    });
    return result;
  }
}
