import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'safe-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrls: ['./search-menu.component.scss'],
})
export class SafeSearchMenuComponent implements OnInit {
  @Input() data: any[] = [];
  private show = true;

  @Output() openApp: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeMenu: EventEmitter<null> = new EventEmitter();

  public searchResults: any = [];
  public search = '';

  @HostListener('click')
  clickInside() {
    this.show = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.show) {
      this.closeMenu.emit();
    }
    this.show = false;
  }

  constructor(private eRef: ElementRef) {}

  ngOnInit(): void {
    this.data.map((value: any) => {
      this.searchResults.push(value);
    });
  }

  onSearch() {
    this.searchResults = [];
    this.data.map((value) => {
      if (value.name?.toLowerCase().includes(this.search.toLowerCase())) {
        this.searchResults.push(value);
      }
    });
  }

  onClick(app: any) {
    this.openApp.emit(app);
    this.closeMenu.emit();
  }
}
