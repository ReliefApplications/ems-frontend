import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';

/**
 *
 */
@Component({
  selector: 'safe-categories-settings',
  templateUrl: './categories-settings.component.html',
  styleUrls: ['./categories-settings.component.scss'],
})
export class CategoriesSettingsComponent {
  @Input() formArray!: FormArray;
}
