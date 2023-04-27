import { Component, Input, AfterContentInit } from '@angular/core';

@Component({
  selector: 'ui-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
})
export class ExpansionPanelComponent implements AfterContentInit{
  @Input() title = '';
  @Input() displayIcon = false;
  @Input() disabled = false;
  @Input() expanded = false;
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0; 
  
  ngAfterContentInit(): void {
      console.log("teste");
  }
}
