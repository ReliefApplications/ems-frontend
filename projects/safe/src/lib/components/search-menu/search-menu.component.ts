import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ElementRef,
} from '@angular/core';

/**
 * Applications Menu, visible in Front-Office
 */
@Component({
  selector: 'safe-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrls: ['./search-menu.component.scss'],
})
export class SafeSearchMenuComponent implements OnInit {
  @Input() data: any[] = [];
  private show = true;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() open: EventEmitter<any> = new EventEmitter<any>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close: EventEmitter<null> = new EventEmitter();

  public searchResults: any = [];
  public search = '';

  /** Listening to the click event on the component and setting the show variable to true. */
  @HostListener('click')
  clickInside() {
    this.show = true;
  }

  /** Listening to the click event outside and setting the show variable to false. */
  @HostListener('document:click')
  clickout() {
    if (!this.show) {
      this.close.emit();
    }
    this.show = false;
  }

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param eRef Unused ElementRef
   */
  constructor(private eRef: ElementRef) {}

  ngOnInit(): void {
    this.searchResults = this.data.slice(0, 5);
  }

  /**
   * Updates searchResults on search
   */
  onSearch() {
    this.searchResults = [];
    const search = this.search.toLowerCase();
    this.searchResults = this.data
      .filter((x) => x.name?.toLowerCase().includes(search))
      .slice(0, 5);
  }

  /**
   * Handles the click on application
   *
   * @param app Item that the user clicked on
   */
  onClick(app: any) {
    this.open.emit(app);
    this.close.emit();
  }
}
