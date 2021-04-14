import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'safe-previous-button',
  templateUrl: './previous-button.component.html',
  styleUrls: ['./previous-button.component.scss']
})
export class SafePreviousButtonComponent implements OnInit {

  @Input() path = '';

  constructor(private router: Router) { }

  ngOnInit(): void {}

  onPrevious(): void {
    this.router.navigate([this.path]);
  }
}
