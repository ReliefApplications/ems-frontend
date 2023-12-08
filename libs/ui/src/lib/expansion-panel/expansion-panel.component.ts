import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  Renderer2,
  ElementRef,
  OnDestroy,
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
 * Expansion Panel is a UI component that allows the user to expand and collapse content.
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
export class ExpansionPanelComponent implements AfterViewInit, OnDestroy {
  /** Boolean indicating whether to display an icon. */
  @Input() displayIcon = true;
  /** Boolean indicating whether the component is disabled. */
  @Input() disabled = false;
  /** Boolean indicating whether the panel is expanded. */
  @Input() expanded = false;
  /** The index of the panel. */
  @Input() index = 0;
  /** Event emitter for closing the panel. */
  @Output() closePanel = new EventEmitter<boolean>();
  /** Reference to the accordion item. */
  @ViewChild('accordionItem') accordionItem!: CdkAccordionItem;
  /** Reference to the content container. */
  @ViewChild('contentContainer') contentContainer!: ElementRef;

  private expansionCloseTimeoutListener!: NodeJS.Timeout;

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
    if (this.expansionCloseTimeoutListener) {
      clearTimeout(this.expansionCloseTimeoutListener);
    }
    this.expansionCloseTimeoutListener = setTimeout(() => {
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

  ngOnDestroy(): void {
    if (this.expansionCloseTimeoutListener) {
      clearTimeout(this.expansionCloseTimeoutListener);
    }
  }
}
