import {
  Component,
  EventEmitter,
  Input,
  Output,
  ContentChildren,
  forwardRef,
  QueryList,
  AfterViewInit,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { startWith } from 'rxjs';

/**
 * UI Select option component
 */
@Component({
  selector: 'ui-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
})
export class SelectOptionComponent implements AfterViewInit{
  @Input() value!: any;
  @Input() selected = false;
  @Input() label = '';
  @Input() isGrouped = false;
  @Output() optionClick = new EventEmitter<any>();

  @ContentChildren(forwardRef(() => SelectOptionComponent))
  options!: QueryList<SelectOptionComponent>;

  constructor(private renderer: Renderer2, private el: ElementRef){}

  ngAfterViewInit(): void {
    this.options?.changes
    .pipe(startWith(this.options))
    .subscribe({
      next: (options: QueryList<SelectOptionComponent>) => {
        options.forEach((option) => {
          const liElement = option.el.nativeElement.querySelector('li');
          this.renderer.addClass(liElement, 'bg-white');
        })
      }
    })
  }

  /**
   * Emit optionClick output and updates option selected status
   */
  onChangeFunction(): void {
    if (this.isGrouped) {
      return;
    }
    this.selected = !this.selected;
    this.optionClick.emit(this.selected);
  }
}
