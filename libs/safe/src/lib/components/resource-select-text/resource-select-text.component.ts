import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionResourceSelectTextModel } from './resource-select-text.model';

@Component({
  selector: 'safe-resource-select-text',
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export class SafeResourceSelectTextComponent
  extends QuestionAngular<QuestionResourceSelectTextModel>
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
    super.ngOnInit();
    const text = document.createElement('div');
    text.innerHTML = 'First you have to select a resource before set filters';
    this.el.nativeElement.appendChild(text);
  }
}
