import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { Variant } from '../shared/variant.enum';

/**
 * Directive that manages the behavior of a navigation tab
 */
@Directive({
  selector: '[uiNavigationTab]',
})
export class NavigationTabDirective implements OnInit {
  ColorVariant = Variant;
  /**
   * Index of the default selected tab
   */
  @Input() selectedIndex = 0;
  /**
   * True if the navigation tab is to be vertical, false otherwise
   */
  @Input() vertical = false;
  /**
   * True if the navigation tab is to be vertical, false otherwise
   */
  @Input() variant = this.ColorVariant.DEFAULT;
  /**
   * Output emitted whenever a new tab is clicked, gives the index of the new tab
   */
  @Output() selectedIndexChangeDirective = new EventEmitter<number>();

  // Content that is to be displayed
  content: any;
  // Current selected tab (used to gives good classes to the tab before selecting another)
  currentSelected!: number;

  // Default classes to render content
  classes = [
    'transition',
    'ease-in-out',
    'delay-150',
    'duration-300',
    'block',
    'py-4',
  ] as const;

  /**
   * Constructor of the directive
   *
   * @param elementRef NavigationTabDirective host reference
   * @param renderer Angular renderer to work with DOM
   */
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Util variables for initialization
    const host = this.elementRef.nativeElement;
    const tabsWrapper = host?.children[0];

    // Manages the vertical or horizontal aspect of the navbar (for tabs)
    if (this.vertical) {
      // For all tabs
      for (const tab of tabsWrapper.children) {
        // Manages classes only if the tabButton is the button inside the tab component
        const tabButton = tab?.children[0]?.children[0];
        if (tabButton?.id === 'buttonTab') {
          this.renderer.removeClass(tabButton, 'border-b-2');
          this.renderer.addClass(tabButton, 'border-r-2');
        }
      }
    } else {
      //Make the ui-tab growing so it occupies all the space available
      for (const tab of host.children[0].children) {
        this.renderer.addClass(tab, 'grow');
      }
    }

    // Launches the content show and class modification function for the selectedIndex tab
    const initialTabButton =
      tabsWrapper?.children[this.selectedIndex]?.children[0]?.children[0];
    if (initialTabButton?.id === 'buttonTab') {
      this.showContent(initialTabButton);
    }
  }

  /**
   * Function that listen for the user's mouse to click the element where the directive is placed
   *
   * @param event event emitted by click
   */
  @HostListener('click', ['$event'])
  onClick(event: any) {
    // If the target of the event is a button of a tab, launch the content show
    if (event.target.id === 'buttonTab') {
      this.showContent(event.target);
      // Avoid double display by preventing event propagation to parent elements
      event.stopPropagation();
    }
  }

  /**
   * Show the content linked to the tab clicked + manages classes so the good tab is selected in design
   *
   * @param target dom element clicked
   */
  showContent(target: any) {
    //Defining useful variables
    const tabs = target.parentElement.parentElement.parentElement.children;
    const currentTabSelected = target.parentElement.parentElement;
    const wrappingDiv =
      target.parentElement.parentElement.parentElement.parentElement;

    // Get unselected classes to old selected
    this.classUnselect(tabs);

    // Get selected classes to newly selected
    this.classSelect(target);

    // Emits the current selected index
    this.currentTabIndexEmission(tabs, currentTabSelected);

    // If there was already content, delete it
    this.deleteContent(wrappingDiv);

    // Creates the content element thanks to the hidden html content of the tab component
    this.createContent(target, wrappingDiv);
  }

  /**
   * Get unselected classes to old selected tab
   *
   * @param tabs list of tabs in the navigation tab
   */
  classUnselect(tabs: any) {
    if (this.currentSelected !== undefined) {
      this.renderer.removeClass(
        tabs[this.currentSelected].children[0].children[0],
        'border-primary-500'
      );
      this.renderer.removeClass(
        tabs[this.currentSelected].children[0].children[0],
        'text-primary-600'
      );
      this.renderer.addClass(
        tabs[this.currentSelected].children[0].children[0],
        'border-transparent'
      );
      if (this.variant !== this.ColorVariant.GREY) {
        this.renderer.addClass(
          tabs[this.currentSelected].children[0].children[0],
          'text-gray-500'
        );
        this.renderer.addClass(
          tabs[this.currentSelected].children[0].children[0],
          'hover:text-gray-700'
        );
      }
      switch (this.variant) {
        case this.ColorVariant.DEFAULT:
          this.renderer.addClass(
            tabs[this.currentSelected].children[0].children[0],
            'hover:border-gray-300'
          );
          break;
        case this.ColorVariant.PRIMARY:
          this.renderer.addClass(
            tabs[this.currentSelected].children[0].children[0],
            'hover:border-primary-300'
          );
          break;
        case this.ColorVariant.SUCCESS:
          this.renderer.addClass(
            tabs[this.currentSelected].children[0].children[0],
            'hover:border-green-300'
          );
          break;
        case this.ColorVariant.DANGER:
          this.renderer.addClass(
            tabs[this.currentSelected].children[0].children[0],
            'hover:border-red-300'
          );
          break;
        case this.ColorVariant.GREY:
          this.renderer.addClass(
            tabs[this.currentSelected].children[0].children[0],
            'hover:border-gray-500'
          );
          this.renderer.addClass(
            tabs[this.currentSelected].children[0].children[0],
            'text-gray-400'
          );
          this.renderer.addClass(
            tabs[this.currentSelected].children[0].children[0],
            'hover:text-gray-100'
          );
          break;
        case this.ColorVariant.LIGHT:
          this.renderer.addClass(
            tabs[this.currentSelected].children[0].children[0],
            'hover:border-gray-300'
          );
          break;
      }
    }
  }

  /**
   * Get selected classes to newly selected
   *
   * @param target dom element clicked
   */
  classSelect(target: any) {
    switch (this.variant) {
      case this.ColorVariant.DEFAULT:
        this.renderer.removeClass(target, 'text-gray-500');
        this.renderer.removeClass(target, 'hover:border-gray-300');
        this.renderer.removeClass(target, 'hover:text-gray-700');
        break;
      case this.ColorVariant.PRIMARY:
        this.renderer.removeClass(target, 'text-gray-500');
        this.renderer.removeClass(target, 'hover:border-primary-300');
        this.renderer.removeClass(target, 'hover:text-gray-700');
        break;
      case this.ColorVariant.SUCCESS:
        this.renderer.removeClass(target, 'text-gray-500');
        this.renderer.removeClass(target, 'hover:border-green-300');
        this.renderer.removeClass(target, 'hover:text-gray-700');
        break;
      case this.ColorVariant.DANGER:
        this.renderer.removeClass(target, 'text-gray-500');
        this.renderer.removeClass(target, 'hover:border-red-300');
        this.renderer.removeClass(target, 'hover:text-gray-700');
        break;
      case this.ColorVariant.LIGHT:
        this.renderer.removeClass(target, 'text-gray-500');
        this.renderer.removeClass(target, 'hover:border-gray-300');
        this.renderer.removeClass(target, 'hover:text-gray-700');
        break;
      case this.ColorVariant.GREY:
        this.renderer.removeClass(target, 'text-gray-100');
        this.renderer.removeClass(target, 'hover:border-gray-500');
        this.renderer.removeClass(target, 'hover:text-gray-400');
        break;
    }
    this.renderer.removeClass(target, 'border-transparent');
    this.renderer.addClass(target, 'border-primary-500');
    this.renderer.addClass(target, 'text-primary-600');
  }

  /**
   * Emits the current selected index
   *
   * @param tabs list of tabs in the navigation tab
   * @param currentTabSelected tab currently selected
   */
  currentTabIndexEmission(tabs: any, currentTabSelected: any) {
    for (const tab of tabs) {
      if (tab.isSameNode(currentTabSelected)) {
        this.selectedIndexChangeDirective.emit(
          Array.prototype.indexOf.call(tabs, tab)
        );
        this.currentSelected = Array.prototype.indexOf.call(tabs, tab);
      }
    }
  }

  /**
   * Delete content displayed currently
   *
   * @param wrappingDiv element wrapping the whole ui-navigation-tab
   */
  deleteContent(wrappingDiv: any) {
    if (this.content) {
      for (const cl of this.classes) {
        this.renderer.removeClass(this.content, cl);
      }
      this.renderer.removeChild(wrappingDiv, this.content);
      this.content = null;
    }
  }

  /**
   * Creates the content element thanks to the hidden html content of the tab component targeted
   *
   * @param target dom element clicked
   * @param wrappingDiv element wrapping the whole ui-navigation-tab
   */
  createContent(target: any, wrappingDiv: any) {
    this.content = this.renderer.createElement('div');
    this.content.innerHTML = target.parentElement.children[1].innerHTML;
    // Manages classes and verticality
    for (const cl of this.classes) {
      this.renderer.addClass(this.content, cl);
    }
    if (this.vertical) {
      this.renderer.addClass(this.content, 'col-span-5');
      this.renderer.addClass(this.content, 'px-4');
    }
    // Actually add content to the wrapping div of the navigation tab content
    this.renderer.appendChild(wrappingDiv, this.content);
  }
}
