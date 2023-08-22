import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  Renderer2,
  ElementRef,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CdkAccordionItem } from '@angular/cdk/accordion';

/**
 * UI Expansion Panel Component
 */
@Component({
  selector: 'ui-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
  animations: [
    trigger('contentExpansion', [
      state('expanded', style({ height: '*', opacity: 1 })),
      state('collapsed', style({ height: '0px', opacity: 0 })),
      transition(
        'expanded <=> collapsed',
        animate('300ms cubic-bezier(.37,1.04,.68,.98)')
      ),
    ]),
    trigger('iconChange', [
      state('up', style({ transform: 'rotate(0deg)' })),
      state('down', style({ transform: 'rotate(180deg)' })),
      transition(
        'up <=> down',
        animate('300ms cubic-bezier(.37,1.04,.68,.98)')
      ),
    ]),
  ],
})
export class ExpansionPanelComponent implements AfterViewInit {
  @Input() displayIcon = true;
  @Input() disabled = false;
  @Input() expanded = false;
  @Input() index = 0;
  @Output() closePanel = new EventEmitter<boolean>();

  @ViewChild('accordionItem') accordionItem!: CdkAccordionItem;
  @ViewChild('contentContainer') contentContainer!: ElementRef;

  /**
   * UI Panel Expansion constructor
   *
   * @param renderer Renderer2
   */
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (this.expanded) {
      this.accordionItem.toggle();
    }
  }

  /**
   * Function detects on close and emit
   */
  onClosed() {
    setTimeout(() => {
      this.renderer.addClass(this.contentContainer.nativeElement, 'hidden');
    }, 100);
    this.closePanel.emit(true);
  }

  /**
   * Function detects on open
   * Method added in order to keep the animation on expansion panel closed as well
   */
  onOpened() {
    this.renderer.removeClass(this.contentContainer.nativeElement, 'hidden');
    this.renderer.addClass(this.contentContainer.nativeElement, 'block');
  }
}
