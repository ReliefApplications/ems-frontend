import { Component, OnInit } from '@angular/core';

/** Model for the data input */
interface DialogData {
  name?: string;
  emails?: string[];
}

/** Component for editing a distribution list */
@Component({
  selector: 'safe-edit-distribution-lists-modal',
  templateUrl: './edit-distribution-lists-modal.component.html',
  styleUrls: ['./edit-distribution-lists-modal.component.scss'],
})
export class EditDistributionListsModalComponent implements OnInit {
  /**
   * Component for editing a distribution list
   */
  constructor() {}

  ngOnInit(): void {}
}
