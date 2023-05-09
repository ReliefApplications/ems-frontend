import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { Variant } from '../shared/variant.enum';

/**
 * Directive that manages the behavior of a navigation tab
 */
@Directive({
  selector: '[uiNavigationTabs]',
})
export class NavigationTabsDirective implements AfterViewInit {
  colorVariant = Variant;
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
  @Input() variant = this.colorVariant.DEFAULT;
  /**
   * Output emitted whenever a new tab is clicked, gives the index of the new tab
   */
  @Output() selectedIndexChange = new EventEmitter<number>();
  /**
   * Output emitted enabling and disabling animation states
   */
  @Output() toggleAnimation = new EventEmitter<boolean>();

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

  ngAfterViewInit() {
    // Util variables for initialization
    const host = this.elementRef.nativeElement;
    const tabsWrapper = host?.children[0];

    console.log('Variant : ' + this.variant);

    // Manages the vertical or horizontal aspect of the navbar (for tabs)
    if (!this.vertical) {
      // if horizontal, add border to bottom
      for (const tab of tabsWrapper.children) {
        // Manages classes only if the tabButton is the button inside the tab component
        const tabButton = tab?.children[0]?.children[0];
        if (tabButton?.id === 'buttonTab') {
          this.initializesClassHorizontal(tabButton);
        }
      }
      //Make the ui-tab growing so it occupies all the space available
      for (const tab of host.children[0].children) {
        if (tab.id !== 'tabs') {
          this.renderer.addClass(tab, 'grow');
        }
      }
    } else {
      // if vertical, add border to right
      for (const tab of tabsWrapper.children) {
        // Manages classes only if the tabButton is the button inside the tab component
        const tabButton = tab?.children[0]?.children[0];
        if (tabButton?.id === 'buttonTab') {
          this.initializesClassVertical(tabButton);
        }
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
    // Timeout so the animation has the time to render (elsewhere it can't cause delete then create is instantaneous)
    setTimeout(() => {
      this.createContent(target, wrappingDiv);
    }, 100);
    // this.createContent(target, wrappingDiv);
  }

  /**
   * Get unselected classes to old selected tab
   *
   * @param tabs list of tabs in the navigation tab
   */
  classUnselect(tabs: any) {
    if (this.currentSelected !== undefined) {
      const target = tabs[this.currentSelected].children[0].children[0];
      if (!this.vertical) {
        this.renderer.removeClass(target, 'border-primary-500');
        this.renderer.removeClass(target, 'text-primary-600');
        this.renderer.addClass(target, 'border-transparent');
        if (this.variant !== this.colorVariant.GREY) {
          this.renderer.addClass(target, 'text-gray-500');
          this.renderer.addClass(target, 'hover:text-gray-700');
        }
        switch (this.variant) {
          case this.colorVariant.DEFAULT:
            this.renderer.addClass(target, 'hover:border-gray-300');
            break;
          case this.colorVariant.PRIMARY:
            this.renderer.addClass(target, 'hover:border-primary-300');
            break;
          case this.colorVariant.SUCCESS:
            this.renderer.addClass(target, 'hover:border-green-300');
            break;
          case this.colorVariant.DANGER:
            this.renderer.addClass(target, 'hover:border-red-300');
            break;
          case this.colorVariant.GREY:
            this.renderer.addClass(target, 'hover:border-gray-500');
            this.renderer.addClass(target, 'text-gray-400');
            this.renderer.addClass(target, 'hover:text-gray-100');
            break;
          case this.colorVariant.LIGHT:
            this.renderer.addClass(target, 'hover:border-gray-300');
            break;
        }
      } else {
        switch (this.variant) {
          case this.colorVariant.DEFAULT:
            this.renderer.addClass(target, 'text-gray-500');
            this.renderer.addClass(target, 'hover:text-gray-700');
            this.renderer.removeClass(target, 'bg-gray-200');
            this.renderer.removeClass(target, 'text-gray-900');
            break;
          case this.colorVariant.PRIMARY:
            this.renderer.addClass(target, 'text-gray-500');
            this.renderer.addClass(target, 'hover:text-gray-700');
            this.renderer.removeClass(target, 'bg-primary-200');
            this.renderer.removeClass(target, 'text-gray-900');
            break;
          case this.colorVariant.SUCCESS:
            this.renderer.addClass(target, 'text-gray-500');
            this.renderer.addClass(target, 'hover:text-gray-700');
            this.renderer.removeClass(target, 'bg-green-200');
            this.renderer.removeClass(target, 'text-gray-900');
            break;
          case this.colorVariant.DANGER:
            this.renderer.addClass(target, 'text-gray-500');
            this.renderer.addClass(target, 'hover:text-gray-700');
            this.renderer.removeClass(target, 'bg-red-200');
            this.renderer.removeClass(target, 'text-gray-900');
            break;
          case this.colorVariant.LIGHT:
            this.renderer.addClass(target, 'text-gray-500');
            this.renderer.addClass(target, 'hover:text-gray-700');
            this.renderer.removeClass(target, 'bg-gray-200');
            this.renderer.removeClass(target, 'text-gray-900');
            break;
          case this.colorVariant.GREY:
            this.renderer.addClass(target, 'text-gray-400');
            this.renderer.addClass(target, 'hover:text-gray-200');
            this.renderer.removeClass(target, 'bg-gray-600');
            this.renderer.removeClass(target, 'text-gray-100');
            break;
        }
      }
    }
  }

  /**
   * Get selected classes to newly selected
   *
   * @param target dom element clicked
   */
  classSelect(target: any) {
    if (!this.vertical) {
      switch (this.variant) {
        case this.colorVariant.DEFAULT:
          this.renderer.removeClass(target, 'text-gray-500');
          this.renderer.removeClass(target, 'hover:border-gray-300');
          this.renderer.removeClass(target, 'hover:text-gray-700');
          break;
        case this.colorVariant.PRIMARY:
          this.renderer.removeClass(target, 'text-gray-500');
          this.renderer.removeClass(target, 'hover:border-primary-300');
          this.renderer.removeClass(target, 'hover:text-gray-700');
          break;
        case this.colorVariant.SUCCESS:
          this.renderer.removeClass(target, 'text-gray-500');
          this.renderer.removeClass(target, 'hover:border-green-300');
          this.renderer.removeClass(target, 'hover:text-gray-700');
          break;
        case this.colorVariant.DANGER:
          this.renderer.removeClass(target, 'text-gray-500');
          this.renderer.removeClass(target, 'hover:border-red-300');
          this.renderer.removeClass(target, 'hover:text-gray-700');
          break;
        case this.colorVariant.LIGHT:
          this.renderer.removeClass(target, 'text-gray-500');
          this.renderer.removeClass(target, 'hover:border-gray-300');
          this.renderer.removeClass(target, 'hover:text-gray-700');
          break;
        case this.colorVariant.GREY:
          this.renderer.removeClass(target, 'text-gray-100');
          this.renderer.removeClass(target, 'hover:border-gray-500');
          this.renderer.removeClass(target, 'hover:text-gray-400');
          break;
      }
      this.renderer.removeClass(target, 'border-transparent');
      this.renderer.addClass(target, 'border-primary-500');
      this.renderer.addClass(target, 'text-primary-600');
    } else {
      switch (this.variant) {
        case this.colorVariant.DEFAULT:
          this.renderer.removeClass(target, 'text-gray-500');
          this.renderer.removeClass(target, 'hover:text-gray-700');
          this.renderer.addClass(target, 'bg-gray-200');
          this.renderer.addClass(target, 'text-gray-900');
          break;
        case this.colorVariant.PRIMARY:
          this.renderer.removeClass(target, 'text-gray-500');
          this.renderer.removeClass(target, 'hover:text-gray-700');
          this.renderer.addClass(target, 'bg-primary-200');
          this.renderer.addClass(target, 'text-gray-900');
          break;
        case this.colorVariant.SUCCESS:
          this.renderer.removeClass(target, 'text-gray-500');
          this.renderer.removeClass(target, 'hover:text-gray-700');
          this.renderer.addClass(target, 'bg-green-200');
          this.renderer.addClass(target, 'text-gray-900');
          break;
        case this.colorVariant.DANGER:
          this.renderer.removeClass(target, 'text-gray-500');
          this.renderer.removeClass(target, 'hover:text-gray-700');
          this.renderer.addClass(target, 'bg-red-200');
          this.renderer.addClass(target, 'text-gray-900');
          break;
        case this.colorVariant.LIGHT:
          this.renderer.removeClass(target, 'text-gray-500');
          this.renderer.removeClass(target, 'hover:text-gray-700');
          this.renderer.addClass(target, 'bg-gray-200');
          this.renderer.addClass(target, 'text-gray-900');
          break;
        case this.colorVariant.GREY:
          this.renderer.removeClass(target, 'text-gray-400');
          this.renderer.removeClass(target, 'hover:text-gray-200');
          this.renderer.addClass(target, 'bg-gray-600');
          this.renderer.addClass(target, 'text-gray-100');
          break;
      }
    }
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
        this.selectedIndexChange.emit(Array.prototype.indexOf.call(tabs, tab));
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
    this.toggleAnimation.emit(false);
    if (this.content) {
      for (const cl of this.classes) {
        this.renderer.removeClass(this.content, cl);
      }
      this.renderer.removeChild(wrappingDiv?.children[1], this.content);
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
    this.toggleAnimation.emit(true);
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
    this.renderer.appendChild(wrappingDiv.children[1], this.content);
  }

  /**
   * Initializes a tab classes for horizontal display
   *
   * @param tabButton tabButton
   */
  initializesClassHorizontal(tabButton: any): void {
    this.renderer.addClass(tabButton, 'border-b-2');
    this.renderer.addClass(tabButton, 'border-transparent');
    switch (this.variant) {
      case this.colorVariant.DEFAULT:
        this.renderer.addClass(tabButton, 'text-gray-500');
        this.renderer.addClass(tabButton, 'hover:bg-gray-100');
        this.renderer.addClass(tabButton, 'hover:border-gray-300');
        this.renderer.addClass(tabButton, 'hover:text-gray-700');
        break;
      case this.colorVariant.PRIMARY:
        this.renderer.addClass(tabButton, 'text-gray-500');
        this.renderer.addClass(tabButton, 'hover:bg-primary-200');
        this.renderer.addClass(tabButton, 'hover:border-primary-300');
        this.renderer.addClass(tabButton, 'hover:text-gray-700');
        break;
      case this.colorVariant.SUCCESS:
        this.renderer.addClass(tabButton, 'text-gray-500');
        this.renderer.addClass(tabButton, 'hover:bg-green-200');
        this.renderer.addClass(tabButton, 'hover:border-green-300');
        this.renderer.addClass(tabButton, 'hover:text-gray-700');
        break;
      case this.colorVariant.DANGER:
        this.renderer.addClass(tabButton, 'text-gray-500');
        this.renderer.addClass(tabButton, 'hover:bg-red-200');
        this.renderer.addClass(tabButton, 'hover:border-red-300');
        this.renderer.addClass(tabButton, 'hover:text-gray-700');
        break;
      case this.colorVariant.LIGHT:
        this.renderer.addClass(tabButton, 'text-gray-500');
        this.renderer.addClass(tabButton, 'hover:bg-gray-200');
        this.renderer.addClass(tabButton, 'hover:border-gray-300');
        this.renderer.addClass(tabButton, 'hover:text-gray-700');
        break;
      case this.colorVariant.GREY:
        this.renderer.addClass(tabButton, 'text-gray-400');
        this.renderer.addClass(tabButton, 'hover:bg-gray-600');
        this.renderer.addClass(tabButton, 'hover:border-gray-500');
        this.renderer.addClass(tabButton, 'hover:text-gray-100');
        break;
    }
  }

  /**
   * Initializes a tab classes for vertical display
   *
   * @param tabButton tabButton
   */
  initializesClassVertical(tabButton: any): void {
    this.renderer.addClass(tabButton, 'rounded-md');
    this.renderer.addClass(tabButton, 'justify-start');
    switch (this.variant) {
      case this.colorVariant.DEFAULT:
        this.renderer.addClass(tabButton, 'text-gray-500');
        this.renderer.addClass(tabButton, 'hover:text-gray-700');
        break;
      case this.colorVariant.PRIMARY:
        this.renderer.addClass(tabButton, 'text-gray-500');
        this.renderer.addClass(tabButton, 'hover:text-gray-700');
        break;
      case this.colorVariant.SUCCESS:
        this.renderer.addClass(tabButton, 'text-gray-500');
        this.renderer.addClass(tabButton, 'hover:text-gray-700');
        break;
      case this.colorVariant.DANGER:
        this.renderer.addClass(tabButton, 'text-gray-500');
        this.renderer.addClass(tabButton, 'hover:text-gray-700');
        break;
      case this.colorVariant.LIGHT:
        this.renderer.addClass(tabButton, 'text-gray-500');
        this.renderer.addClass(tabButton, 'hover:text-gray-700');
        break;
      case this.colorVariant.GREY:
        this.renderer.addClass(tabButton, 'text-gray-400');
        this.renderer.addClass(tabButton, 'hover:text-gray-200');
        break;
    }
  }
}
