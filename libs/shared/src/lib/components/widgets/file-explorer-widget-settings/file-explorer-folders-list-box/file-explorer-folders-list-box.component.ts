import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ListBoxModule,
  ListBoxToolbarConfig,
} from '@progress/kendo-angular-listbox';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

/** List of all tags available in system */
const ALL_TAGS = [
  {
    text: 'Aetiology',
    value: 'aetiologyid',
  },
  {
    text: 'Confidentiality',
    value: 'informationconfidentialityid',
  },
  {
    text: 'Country',
    value: 'countryid',
  },
  {
    text: 'Disease Condition',
    value: 'diseasecondid',
  },
  {
    text: 'Document Category',
    value: 'documentcategoryid',
  },
  {
    text: 'Document Type',
    value: 'documenttypeid',
  },
  {
    text: 'Hazard',
    value: 'hazardid',
  },
  {
    text: 'IHR Communication',
    value: 'ihrcommunicationid',
  },
  {
    text: 'IMS Function',
    value: 'assignmentfunctionid',
  },
  {
    text: 'IMS Role',
    value: 'roletypeid',
  },
  {
    text: 'Language',
    value: 'languageid',
  },
  {
    text: 'Occurrence',
    value: 'occurrenceid',
  },
  {
    text: 'Occurrence Type',
    value: 'occurrencetype',
  },
  {
    text: 'Region',
    value: 'regionid',
  },
  {
    text: 'Source of information - type',
    value: 'sourceofinformationid',
  },
  {
    text: 'Syndrome',
    value: 'syndromeid',
  },
];

/**
 * Component for displaying a list box of folders with tags in the file explorer widget settings.
 * Allows users to select and manage tags for folders.
 * Uses Kendo UI ListBox for selection and management of tags.
 */
@Component({
  selector: 'shared-file-explorer-folders-list-box',
  standalone: true,
  imports: [CommonModule, ListBoxModule],
  templateUrl: './file-explorer-folders-list-box.component.html',
  styleUrls: ['./file-explorer-folders-list-box.component.scss'],
})
export class FileExplorerFoldersListBoxComponent implements OnInit {
  /** Current form group */
  @Input() formGroup!: FormGroup;

  /** Listbox toolbar settings */
  public toolbarSettings: ListBoxToolbarConfig = {
    position: 'right',
    tools: [
      'moveUp',
      'moveDown',
      'transferFrom',
      'transferTo',
      'transferAllFrom',
      'transferAllTo',
    ],
  };
  /** Available tags for selection */
  public availableTags: { text: string; value: string }[] = [];
  /** Selected tags */
  public selectedTags: { text: string; value: string }[] = [];

  ngOnInit(): void {
    this.availableTags = [...ALL_TAGS];
    // Get initial selected tags
    const initialValue: string[] = this.formGroup.get('tags')?.value ?? [];
    this.availableTags = ALL_TAGS.filter(
      (tag) => !initialValue.includes(tag.value)
    );
    this.selectedTags = ALL_TAGS.filter((tag) =>
      initialValue.includes(tag.value)
    ).sort(
      (a, b) => initialValue.indexOf(a.value) - initialValue.indexOf(b.value)
    );
  }

  /**
   * On action click, update the form control with selected tags
   */
  public handleActionClick() {
    this.formGroup.setControl(
      'tags',
      new FormArray(this.selectedTags.map((x) => new FormControl(x.value)))
    );
  }
}
