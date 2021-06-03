import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'safe-search-resource-grid-modal',
  templateUrl: './search-resource-grid-modal.component.html',
  styleUrls: ['./search-resource-grid-modal.component.css']
})
export class SafeResourceGridModalComponent implements OnInit {

  public resourceName = '';
  public multiSelect = false;
  public records: any[] = [];
  public gridFields: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      id: string,
      name: string,
      multiselect: boolean
    },
  ) {
    console.log('NAME', name);
    this.multiSelect = data.multiselect;
    // this.getResourceById(data.id);
  }

  ngOnInit(): void {
  }

}
