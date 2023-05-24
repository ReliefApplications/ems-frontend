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
  @Output() closePanel = new EventEmitter<any>();

  @ViewChild('accordionItem') accordionItem!: CdkAccordionItem;
  @ViewChild('contentContainer') contentContainer!: ElementRef;

  // True if this panel is the last of the accordion
  public lastOfAccordion = false;
  // Element where to add class to when wanting to modify the panel appearance
  private divElement!: Element;

  /**
   * UI Panel Expansion constructor
   *
   * @param renderer Renderer2
   * @param el ElementReference
   */
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Getting the full accordion
    const accordion = this.el.nativeElement.parentNode;
    // Initializing div element
    this.divElement = this.el.nativeElement.querySelector('div');

    // List of all indexes of the accordion
    const indexes = [];

    // Filling list of indexes
    for (const item of accordion.querySelectorAll('cdk-accordion-item')) {
      indexes.push(Number(item.id.split('-')[2]));
    }

    // If this panel is the last of the accordion, set the proper parameter to true
    if (this.index === Math.max(...indexes)) {
      this.lastOfAccordion = true;
    }

    // Expand this panel if needed
    if (this.expanded) {
      this.accordionItem.toggle();
    }

    // Add proper classes if this panel is the last of the accordion
    // Depends of the initial state of the panel
    if (this.lastOfAccordion && !this.expanded) {
      this.renderer.addClass(
        this.contentContainer.nativeElement,
        'rounded-b-xl'
      );
      this.renderer.addClass(this.divElement, 'rounded-b-xl');
    } else if (this.lastOfAccordion) {
      this.renderer.addClass(
        this.contentContainer.nativeElement,
        'rounded-b-xl'
      );
    }
  }

  /**
   * Function detects on close and emit
   */
  onClosed() {
    setTimeout(() => {
      // Hide content
      this.renderer.addClass(this.contentContainer.nativeElement, 'hidden');
      // Add class to have last panel with a rounded bottom
      if (this.lastOfAccordion) {
        this.renderer.addClass(this.divElement, 'rounded-b-xl');
      }
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
    // Remove rounded bottom to the panel title if content is displayed
    if (this.lastOfAccordion) {
      this.renderer.removeClass(this.divElement, 'rounded-b-xl');
    }
  }
}
