import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import {
  Resource,
  ResourcesQueryResponse,
} from '../../../../models/resource.model';
import { EmailService } from '../../email.service';

/**
 * create-dataset page component.
 */
@Component({
  selector: 'app-create-dataset',
  templateUrl: './create-dataset.component.html',
  styleUrls: ['./create-dataset.component.scss'],
})
export class CreateDatasetComponent implements OnInit {
  /** Tab index for filtering. */
  public tabIndex = 'filter';

  /** GraphQL query reference for fetching resources. */
  public resourcesQuery!: QueryRef<ResourcesQueryResponse>;

  /** Observable for available queries. */
  public availableQueries!: Observable<any[]>;

  /** Selected resource. */
  public resource!: Resource;

  /** Form array for filter fields. */
  public filterFields: FormArray | any = new FormArray([]);

  /** Cached elements. */
  public cachedElements: Resource[] = [];

  /** Selected resource ID. */
  public selectedResourceId: string | undefined;

  /** Operators for filtering. */
  public operators!: { value: string; label: string }[];

  /** Notification types for email service. */
  public notificationTypes: string[] = this.emailService.notificationTypes;

  /** Form group for data set. */
  public dataSetFormGroup: FormGroup | any = this.emailService.datasetsForm;

  /** Form group for data set group. */
  public dataSetGroup: FormGroup | any =
    this.emailService.createNewDataSetGroup();

  /** Tabs configuration. */
  public tabs: {
    title: string;
    content: string;
    active: boolean;
    index: number;
  }[] = this.emailService.tabs;

  /** Search query. */
  public searchQuery = '';

  /** Selected search field. */
  public searchSelectedField = '';

  /** Filtered fields for search. */
  public filteredFields: any[] = [];

  /** Active tab. */
  public activeTab: any =
    this.emailService.tabs[this.emailService.tabs.length - 1];

  /** List of data. */
  public dataList!: { [key: string]: string }[];

  /** Selected fields. */
  public selectedFields!: { name: string; type: string }[];

  /** Preview data for all elements. */
  public allPreviewData: any = {};

  /** Flag to control the visibility of preview. */
  public showPreview = false;

  /** View child for Kendo Strip. */
  @ViewChild('kendoStrip') kendoStrip: any;

  /**
   * Composite filter group.
   *
   * @param fb Angular form builder
   * @param emailService helper functions
   */
  constructor(private fb: FormBuilder, public emailService: EmailService) {
    this.emailService.disableSaveAndProceed.next(false);
  }

  ngOnInit(): void {
    this.allPreviewData = this.emailService.getAllPreviewData();
    this.filteredFields = this.resource?.fields;
    this.tabIndex = this.activeTab.index;
    if (this.emailService.notificationTypes.length > 0) {
      this.dataSetFormGroup.controls['notificationType'].setValue(
        this.emailService.notificationTypes[0]
      );
      this.emailService.datasetsForm.controls['notificationType'].setValue(
        this.emailService.notificationTypes[0]
      );
    }
  }

  /**
   * This function is used to select a tab.
   *
   * @param tab The tab to be selected.
   */
  onTabSelect(tab: any): void {
    this.activeTab = tab;
    this.activeTab.active = true;
  }

  /**
   *  This function is used to change to the correct tab.
   *
   * @param tabIndex The index of the tab thats been selected.
   */
  changeTab(tabIndex: any) {
    if (tabIndex !== undefined) {
      this.tabIndex = tabIndex;
      this.activeTab = this.emailService.tabs[tabIndex];
      this.activeTab.active = true;
      this.activeTab.index = tabIndex;
      this.kendoStrip.selectTab(tabIndex);
      this.emailService.tabs.forEach((tab, index) => {
        tab.active = index === tabIndex; // Set active to true for the selected index, false otherwise
      });
    }
  }

  /**
   * Gets the datasets form array from the dataSetFormGroup
   * (Fields, Filter {Fields, Operators, Values})
   *
   * @returns The datasets form array from the dataSetFormGroup
   */
  get datasetsFormArray() {
    return this.dataSetFormGroup.get('dataSets') as FormArray;
  }

  /**
   * Grabs filter row values.
   *
   *  @returns FormGroup
   */
  get getNewFilterFields(): FormGroup {
    return this.fb.group({
      field: [],
      operator: [],
      value: [],
      hideEditor: false,
    });
  }

  /**
   * Gets the form controls
   *
   * @returns form control
   */
  get formControllers() {
    return this.dataSetFormGroup.controls;
  }

  /**
   * Dynamic Form Submission
   */
  onSubmit(): void {
    const finalResponse = this.dataSetFormGroup.value;
    console.log('Final Response', finalResponse);
  }

  /**
   * Adds a tab
   */
  public addTab() {
    this.tabs.forEach((tab) => (tab.active = false));
    this.tabs.push({
      title: `Block ${this.tabs.length + 1}`,
      content: `Block ${this.tabs.length + 1} Content`,
      active: true,
      index: this.tabs.length,
    });
    this.activeTab =
      this.tabs.filter((tab: any) => tab.active == true).length > 0
        ? this.tabs.filter((tab: any) => tab.active == true)[0]
        : '';
    this.datasetsFormArray.push(this.emailService.createNewDataSetGroup());
  }

  /**
   * Deletes a block tab at the specified index.
   *
   * @param index The index of the tab to delete.
   * @param event The event that triggered the deletion.
   */
  public deleteTab(index: number, event: Event) {
    event.stopPropagation();
    this.datasetsFormArray.removeAt(index); // Remove the associated form group from datasetsFormArray
    this.allPreviewData = this.allPreviewData.filter(
      (ele: any, count: number) => index !== count
    );
    this.emailService.setAllPreviewData(this.allPreviewData);
    this.tabs.splice(index, 1);
    this.activeTab =
      this.activeTab.active == true && this.tabs.length > 0
        ? this.tabs[this.tabs.length - 1]
        : this.activeTab;
    this.activeTab.active = true;
  }

  /**
   * This function binds the preview table with the provided data.
   *
   * @param previewData The data to be used for the preview table.
   */
  public bindPreviewTbl(previewData: any) {
    this.allPreviewData = previewData;
    this.showPreview = true;
  }
}
