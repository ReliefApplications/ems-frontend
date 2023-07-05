import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { createTabForm } from '../../tabs-settings.form';

@Component({
  selector: 'safe-tabs-tab',
  templateUrl: './tabs-tab.component.html',
  styleUrls: ['./tabs-tab.component.scss'],
})
export class TabsTabComponent {
  @Input() formArray!: FormArray;

  constructor(private fb: FormBuilder) {}

  public addTab(event: MouseEvent): void {
    this.formArray.push(createTabForm(this.fb));
    event.stopPropagation();
  }

  public deleteTab(index: number): void {
    this.formArray.removeAt(index);
  }
}
