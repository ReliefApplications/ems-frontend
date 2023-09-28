import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ElementRef,
  TemplateRef,
} from '@angular/core';
import { Application } from '../../models/application.model';

/**
 * Applications Menu, visible in Front-Office
 */
@Component({
  selector: 'shared-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrls: ['./search-menu.component.scss'],
})
export class SearchMenuComponent implements OnInit {
  @Input() currentApplicationId: string | undefined = '';
  @Input() applications: Application[] = [];
  @Input() headerTemplate?: TemplateRef<any>;
  private show = true;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() open: EventEmitter<any> = new EventEmitter<any>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close: EventEmitter<null> = new EventEmitter();

  public currentApplication: Application | undefined;
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
    this.searchResults = this.applications
      .filter((x) => x.id !== this.currentApplicationId)
      .slice(0, 5);
    this.currentApplication = this.applications.find(
      (x) => x.id === this.currentApplicationId
    );
  }

  /**
   * Updates searchResults on search
   */
  onSearch() {
    this.searchResults = [];
    const search = this.search.toLowerCase();
    this.searchResults = this.applications
      .filter((x) => x.id !== this.currentApplicationId)
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
