import { Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { divisionForm } from '../../map-forms';

/** Interface of dialog data of the component */
interface DialogData {
  value: any;
  fields: any[];
  query: any;
}

/**
 * Single clorophlet configuration component.
 */
@Component({
  selector: 'safe-map-clorophlet-division',
  templateUrl: './map-clorophlet-division.component.html',
  styleUrls: ['./map-clorophlet-division.component.scss'],
})
export class MapClorophletDivisionComponent {
  public form!: UntypedFormGroup;

  public fields: any[] = [];
  public query: any;

  /**
   * Single clorophlet configuration component.
   *
   * @param data dialog data
   */
  constructor(@Inject(DIALOG_DATA) public data: DialogData) {
    this.form = divisionForm(data.value);
    this.fields = data.fields;
    this.query = data.query;
  }
}
