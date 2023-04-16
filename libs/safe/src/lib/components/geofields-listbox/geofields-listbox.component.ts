import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBoxModule } from '@progress/kendo-angular-listbox';

@Component({
  selector: 'safe-geofields-listbox',
  standalone: true,
  imports: [CommonModule, ListBoxModule],
  templateUrl: './geofields-listbox.component.html',
  styleUrls: ['./geofields-listbox.component.scss'],
})
export class GeofieldsListboxComponent {
  public availableFields: string[] = ['Country'];
  @Input() selectedFields: string[] = [];
}
