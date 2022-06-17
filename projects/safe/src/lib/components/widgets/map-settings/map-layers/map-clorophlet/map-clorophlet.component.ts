import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { clorophletForm, divisionForm } from '../../map-forms';
import { MapClorophletDivisionComponent } from '../map-clorophlet-division/map-clorophlet-division.component';

/** Interface of dialog data of the component */
interface DialogData {
  value: any;
}

/**
 * Single Clorophlet Configuration in Map Settings.
 */
@Component({
  selector: 'safe-map-clorophlet',
  templateUrl: './map-clorophlet.component.html',
  styleUrls: ['./map-clorophlet.component.scss'],
})
export class MapClorophletComponent implements OnInit {
  public form!: FormGroup;

  public tableColumns = ['label', 'actions'];

  /**
   * Clorophlet divisions as form array.
   *
   * @returns Divisions as form array.
   */
  get divisions(): FormArray {
    return this.form.get('divisions') as FormArray;
  }

  /**
   * Single Clorophlet Configuration in Map Settings.
   *
   * @param data dialog data
   * @param dialog Material dialog service
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialog: MatDialog
  ) {
    this.form = clorophletForm(data.value);
    if (this.form.value.geoJSON) {
      this.updateGeoJSONfields(this.form.value.geoJSON);
    }
  }

  selectedFields: any[] = [];
  geoJSONfields: string[] = [];

  ngOnInit(): void {}

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
  public editDivision(index: number): void {
    const dialogRef = this.dialog.open(MapClorophletDivisionComponent, {
      data: {
        value: this.divisions.at(index).value,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.divisions.at(index).setValue(value);
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
