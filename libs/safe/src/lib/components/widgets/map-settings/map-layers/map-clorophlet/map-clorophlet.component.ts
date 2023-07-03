import { Component, Inject } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { clorophletForm, divisionForm } from '../../map-forms';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';

/** Interface of dialog data of the component */
interface DialogData {
  value: any;
  fields: any[];
  formattedFields: any[];
  query: any;
}

/**
 * Single Clorophlet Configuration in Map Settings.
 */
@Component({
  selector: 'safe-map-clorophlet',
  templateUrl: './map-clorophlet.component.html',
  styleUrls: ['./map-clorophlet.component.scss'],
})
export class MapClorophletComponent extends SafeUnsubscribeComponent {
  public form!: UntypedFormGroup;

  public tableColumns = ['label', 'color', 'actions'];

  public fields: any[] = [];
  public formattedFields: any[] = [];
  public geoJSONfields: string[] = [];
  public query: any;

  /**
   * Clorophlet divisions as form array.
   *
   * @returns Divisions as form array.
   */
  get divisions(): UntypedFormArray {
    return this.form.get('divisions') as UntypedFormArray;
  }

  /**
   * Single Clorophlet Configuration in Map Settings.
   *
   * @param data dialog data
   * @param dialog Dialog service
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    private dialog: Dialog
  ) {
    super();
    this.form = clorophletForm(data.value);
    this.fields = data.fields;
    this.formattedFields = data.formattedFields;
    this.query = data.query;
    if (this.form.value.geoJSON) {
      this.updateGeoJSONfields(this.form.value.geoJSON);
    }
  }

  /**
   * Adds a new division.
   */
  public addDivision(): void {
    this.divisions.push(divisionForm());
  }

  /**
   * Remove division at index.
   *
   * @param index index of division to remove
   */
  public removeDivision(index: number): void {
    this.divisions.removeAt(index);
  }

  /**
   * Edit division at index.
   *
   * @param index index of division to edit
   */
  public async editDivision(index: number): Promise<void> {
    const { MapClorophletDivisionComponent } = await import(
      '../map-clorophlet-division/map-clorophlet-division.component'
    );
    const dialogRef = this.dialog.open(MapClorophletDivisionComponent, {
      data: {
        value: this.divisions.at(index).value,
        fields: this.formattedFields,
        query: this.query,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.divisions.setControl(index, divisionForm(value));
      }
    });
  }

  /**
   * Add a GeoJSON file to the clorophlet.
   */
  public async uploadGeoJSON(): Promise<void> {
    const file = document.getElementById('geojson') as HTMLInputElement;
    if (file) {
      if (file.files && file.files.length > 0) {
        this.form.patchValue({
          geoJSONname: file.files[0].name,
          geoJSON: await file.files[0].text(),
        });
        this.updateGeoJSONfields(this.form.value.geoJSON);
      }
    }
  }

  /**
   * Updates the geoJSON selectable fields.
   *
   * @param geoJSON geoJSON to check.
   */
  private updateGeoJSONfields(geoJSON: string): void {
    const parsed = JSON.parse(geoJSON);
    this.geoJSONfields = [];
    for (const property of Object.keys(parsed.features[0].properties)) {
      this.geoJSONfields.push(property);
    }
  }
}
