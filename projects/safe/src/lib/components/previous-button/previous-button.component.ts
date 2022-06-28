import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Component used to display a previous button
 */
@Component({
  selector: 'safe-previous-button',
  templateUrl: './previous-button.component.html',
  styleUrls: ['./previous-button.component.scss'],
})
export class SafePreviousButtonComponent implements OnInit {
  @Input() path = '';

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param router This is a service that provides navigation and routing
   */
  constructor(private router: Router) {}

  ngOnInit(): void {}

  /**
   * Handles the click on this previous button
   */
  onPrevious(): void {
    this.router.navigate([this.path]);
  }
}
