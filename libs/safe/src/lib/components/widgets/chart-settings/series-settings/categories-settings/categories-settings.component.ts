import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Variant } from '@oort-front/ui';

/**
 * Chart serie: categories setting component.
 */
@Component({
  selector: 'safe-categories-settings',
  templateUrl: './categories-settings.component.html',
  styleUrls: ['./categories-settings.component.scss'],
})
export class CategoriesSettingsComponent {
  @Input() formArray!: FormArray;

  // === BUTTON VARIANTS ===
  public colorVariant = Variant;
}
