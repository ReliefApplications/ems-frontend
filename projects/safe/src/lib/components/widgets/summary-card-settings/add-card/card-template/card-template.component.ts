import { Component, OnInit, Input } from '@angular/core';

/**
 * This component is used to display the add application button
 */
@Component({
  selector: 'safe-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.scss'],
})
export class SafeCardTemplateComponent implements OnInit {
  @Input() title = '';
  @Input() dashboardName = '';
  @Input() isDynamic = false;
  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   */
  constructor() {}

  ngOnInit(): void {}
}
