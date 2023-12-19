import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListBoxModule,
  ListBoxToolbarConfig,
} from '@progress/kendo-angular-listbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeoProperties } from '../../../components/geospatial-map/geospatial-map.interface';
import { Dialog } from '@angular/cdk/dialog';
import { GeoField } from './geofield.type';
import { Subject, takeUntil } from 'rxjs';
import { IconModule } from '@oort-front/ui';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionGeospatialListboxModel } from './geofields-listbox.model';
import { getGeoFields } from '../utils/get-geospatial-fields';

/** All available fields */
export const ALL_FIELDS: { value: keyof GeoProperties; label: string }[] = [
  { value: 'coordinates', label: 'Coordinates' },
  { value: 'city', label: 'City' },
  { value: 'countryName', label: 'Country Name' },
  { value: 'countryCode', label: 'Country Code' },
  { value: 'district', label: 'District' },
  { value: 'region', label: 'Region' },
  //{ value: 'street', label: 'Street' },
  { value: 'subRegion', label: 'Sub Region' },
  { value: 'address', label: 'Address' },
];

/** Component for the selection of the interest fields from geospatial question */
@Component({
  selector: 'shared-geofields-listbox',
  standalone: true,
  imports: [
    CommonModule,
    ListBoxModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
  ],
  templateUrl: './geofields-listbox.component.html',
  styleUrls: ['./geofields-listbox.component.scss'],
})
export class GeofieldsListboxComponent
  extends QuestionAngular<QuestionGeospatialListboxModel>
  implements OnInit, OnChanges, OnDestroy
{
  /** Selected fields */
  selectedFields: { value: keyof GeoProperties; label: string }[] = [];
  /** Available fields */
  public availableFields = ALL_FIELDS;
  /** Toolbar settings */
  public toolbarSettings: ListBoxToolbarConfig = {
    position: 'right',
    tools: [
      'moveUp',
      'moveDown',
      'transferFrom',
      'transferTo',
      'transferAllFrom',
      'transferAllTo',
    ],
  };

  /** Destroy subject */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Component for the selection of the interest fields from geospatial question
   *
   * @param {ChangeDetectorRef} changeDetectorRef - Angular - This is angular change detector ref of the component instance needed for the survey AngularQuestion class
   * @param {ViewContainerRef} viewContainerRef - Angular - This is angular view container ref of the component instance needed for the survey AngularQuestion class
   * @param {Dialog} dialog - Angular CDK - This is the Dialog service that is used to handle cdk dialogs
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef,
    public dialog: Dialog
  ) {
    super(changeDetectorRef, viewContainerRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.selectedFields = getGeoFields({ geoFields: this.model.value });
    this.availableFields = ALL_FIELDS.filter(
      (x) => !this.selectedFields.some((obj) => obj.value === x.value)
    );
  }

  ngOnChanges(): void {
    this.availableFields = ALL_FIELDS.filter(
      (x) => !this.selectedFields.some((obj) => obj.value === x.value)
    );
  }

  /** Emits select fields on action click */
  handleActionClick(): void {
    this.model.value = this.selectedFields ?? [];
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Open dialog to edit label
   *
   * @param geofield Geofield to edit
   */
  async editLabel(geofield: GeoField): Promise<void> {
    const { EditGeofieldComponent } = await import(
      './edit-geofield/edit-geofield.component'
    );
    const dialogRef = this.dialog.open(EditGeofieldComponent, {
      data: {
        geofield,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        const modified_fields = this.availableFields.map((field) => {
          if (field.value === geofield.value) {
            return { ...field, label: value.label };
          }
          return field;
        });
        this.availableFields = modified_fields;

        const modified_selectedFields = this.selectedFields.map((field) => {
          if (field.value === geofield.value) {
            return { ...field, label: value.label };
          }
          return field;
        });
        this.selectedFields = modified_selectedFields;
        //update the value of the fields in others components
        this.handleActionClick();
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
