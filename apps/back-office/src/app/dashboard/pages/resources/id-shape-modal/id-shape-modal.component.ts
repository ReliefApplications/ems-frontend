import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UnsubscribeComponent } from '@oort-front/shared';
import { isNil } from 'lodash';
import { takeUntil } from 'rxjs';

/**
 * Interface with the resource id shape data
 */
interface DialogData {
  shape: string;
  padding: number;
}

/**
 * Modal to update resource incremental id shape.
 */
@Component({
  selector: 'app-id-shape-modal',
  templateUrl: './id-shape-modal.component.html',
  styleUrls: ['./id-shape-modal.component.scss'],
})
export class IdShapeModalComponent extends UnsubscribeComponent {
  /** Id shape form group */
  public idShapeForm = this.fb.group({
    shape: [this.data?.shape, Validators.required],
    padding: [this.data?.padding, Validators.required],
  });
  /** If shape input is valid */
  public validShape = false;
  /** Example of incremental id using the shape input */
  public incrementalIdExample?: string;

  /**
   * Channel component, act as modal.
   * Used for both edition and addition of channels.
   *
   * @param fb Angular form builder
   * @param data Injected dialog data
   */
  constructor(
    private fb: FormBuilder,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {
    super();
    if (this.data) {
      this.parseIDExpression(this.data.shape);
    }

    // Listen to changes on the form to check the expression validity
    this.idShapeForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() =>
        this.parseIDExpression(this.idShapeForm.controls.shape.value ?? '')
      );
  }

  /**
   * Parse the ID expression and return an example of the expression
   *
   * @param expression The expression to parse
   */
  public parseIDExpression(expression: string): void {
    // Padding for the incremental id
    const padding = this.idShapeForm.controls.padding.value;
    expression = expression.trim();
    // The expression must include {incremental}
    if (!expression.includes('{incremental}') || isNil(padding)) {
      this.validShape = false;
      this.incrementalIdExample = undefined;
      return;
    }
    let res = expression;

    const randomId = Math.floor(Math.random() * 1000) + 1;
    const year = new Date().getFullYear();
    const resourceInitial = 'R';
    const resourceName = 'RESOURCE_NAME';

    // Replace all instances of {incremental} with the randomId padded with 0s
    res = res.replace(
      /{incremental}/g,
      randomId.toString().padStart(padding as number, '0')
    );

    // Replace all instances of {year} with the current year
    res = res.replace(/{year}/g, year.toString());

    // Replace all instances of {resourceInitial} with the first letter of the form name
    res = res.replace(/{resourceInitial}/g, resourceInitial);

    // Replace all instances of {resourceName} with the form name
    res = res.replace(/{resourceName}/g, resourceName);

    this.validShape = true;
    this.incrementalIdExample = res;
  }
}
