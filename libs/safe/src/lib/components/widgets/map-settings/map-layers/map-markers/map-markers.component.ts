import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { markerRuleForm } from '../../map-forms';
import { Variant, Category } from '@oort-front/ui';

/**
 * Component of Map widget marker rules.
 */
@Component({
  selector: 'safe-map-markers',
  templateUrl: './map-markers.component.html',
  styleUrls: ['./map-markers.component.scss'],
})
export class MapMarkersComponent implements OnInit {
  @Input() form!: UntypedFormGroup;

  @Input() selectedFields: any[] = [];
  @Input() formattedSelectedFields: any[] = [];
  public numberFields: any[] = [];

  // === UI VARIANT AND CATEGORY ===
  public variant = Variant;
  public category = Category;

  /**
   * Get marker rules as form array.
   *
   * @returns Form Array
   */
  get rules(): UntypedFormArray {
    return this.form.get('markerRules') as UntypedFormArray;
  }

  public tableColumns = ['label', 'color', 'actions'];

  /**
   * List of rules in Map Settings
   *
   * @param dialog Material Dialog Service
   */
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Build list of number fields
    this.numberFields = this.getNumberFields(this.formattedSelectedFields);
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
  public async editRule(index: number): Promise<void> {
    const { MapMarkerRuleComponent } = await import(
      '../map-marker-rule/map-marker-rule.component'
    );
    const dialogRef = this.dialog.open(MapMarkerRuleComponent, {
      data: {
        value: this.rules.at(index).value,
        fields: this.formattedSelectedFields,
        query: this.form.get('query'),
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.rules.setControl(index, markerRuleForm(value));
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

  /**
   * Get the names of the fields with a number format
   *
   * @param formattedFields The list of formatted fields
   * @returns A list of fields names of type number
   */
  private getNumberFields(formattedFields: any[]): any[] {
    return formattedFields
      .filter((field: any) => field.type === 'numeric')
      .map((field) => field.name)
      .concat(
        formattedFields
          .filter((field) => field.fields)
          .map((field) =>
            this.getNumberFields(field.fields).map(
              (numberField) => `${field.name}.${numberField}`
            )
          )
          .reduce((res, subFields) => res.concat(subFields), [])
      );
  }
}
