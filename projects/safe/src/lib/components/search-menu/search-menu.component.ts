import { Component, EventEmitter, HostListener, Input, OnInit, Output, ElementRef } from '@angular/core';

@Component({
  selector: 'safe-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrls: ['./search-menu.component.scss']
})
export class SafeSearchMenuComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() show: boolean = true;

  @Output() openApplication: EventEmitter<any> = new EventEmitter();
  @Output() closeMenu: EventEmitter<null> = new EventEmitter();

  public searchResults: any = [];
  public search = ""; 
  
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if(!this.eRef.nativeElement.contains(event.target) && this.show) {
      console.log('outside')
      this.closeMenu.emit();
    }
  }

  constructor(private eRef: ElementRef) { }

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

}
