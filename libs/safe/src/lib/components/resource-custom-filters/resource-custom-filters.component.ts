import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionResourceCustomFiltersModel } from './resource-select-text.model';

@Component({
  selector: 'safe-resource-custom-filters',
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export class SafeResourceCustomFiltersComponent
  extends QuestionAngular<QuestionResourceCustomFiltersModel>
  implements OnInit
{
  constructor(
    private el: ElementRef,
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef
  ) {
    super(changeDetectorRef, viewContainerRef);
  }

  override ngOnInit(): void {
    const text = document.createElement('div');
    text.innerHTML =
      'You can use curly brackets to get access to the question values.' +
      '<br><b>field</b>: select the field to be filter by.' +
      '<br><b>operator</b>: contains, =, !=, >, <, >=, <=' +
      '<br><b>value:</b> {question1} or static value' +
      '<br><b>Example:</b>' +
      '<br>[{' +
      '<br>"field": "name",' +
      '<br>"operator":"contains",' +
      '<br>"value": "Laura"' +
      '<br>},' +
      '<br>{' +
      '<br>"field":"age",' +
      '<br>"operator": ">",' +
      '<br>"value": "{question1}"' +
      '<br>}]';
    this.el.nativeElement.appendChild(text);
  }
}
