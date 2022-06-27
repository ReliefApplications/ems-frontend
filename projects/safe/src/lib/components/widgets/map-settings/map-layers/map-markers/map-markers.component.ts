import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import get from 'lodash/get';
import { markerRuleForm } from '../../map-forms';
import { MapMarkerRuleComponent } from '../map-marker-rule/map-marker-rule.component';

/**
 * Component of Map widget marker rules.
 */
@Component({
  selector: 'safe-map-markers',
  templateUrl: './map-markers.component.html',
  styleUrls: ['./map-markers.component.scss'],
})
export class MapMarkersComponent implements OnInit {
  @Input() form!: FormGroup;

  @Input() formatedSelectedFields: any[] = [];
  @Input() allFields: any[] = [];
  public numberFields: any[] = [];

  /**
   * Get marker rules as form array.
   *
   * @returns Form Array
   */
  get rules(): FormArray {
    return this.form.get('markerRules') as FormArray;
  }

  public tableColumns = ['label', 'actions'];

  /**
   * List of rules in Map Settings
   *
   * @param dialog Material Dialog Service
   */
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Build list of number fields
    this.numberFields = this.allFields
      .filter((field: any) =>
        ['Int', 'Float'].includes(get(field, 'type.name', ''))
      )
      .map((field: any) => field.name);
  }

  /**
   * Adds a new rule.
   */
  public addRule(): void {
    this.rules.push(markerRuleForm());
    this.editRule(this.rules.length - 1);
  }

  /**
   * Open dialog to edit rule at index.
   *
   * @param index index of rule to edit.
   */
  public editRule(index: number): void {
    const dialogRef = this.dialog.open(MapMarkerRuleComponent, {
      data: {
        value: this.rules.at(index).value,
        fields: this.formatedSelectedFields,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.rules.removeAt(index);
        this.rules.insert(index, markerRuleForm(value));
      }
    });
  }

  /**
   * Remove a rule.
   *
   * @param index position of the rule to delete.
   */
  public removeRule(index: number): void {
    this.rules.removeAt(index);
  }
}
